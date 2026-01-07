import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthstore } from "./useauthstore";
 const notiFicationSound=new Audio("/sounds/notification.mp3")

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  error: null,
  isSoundEnabled:
    localStorage.getItem("isSoundEnabled") === null
      ? true
      : localStorage.getItem("isSoundEnabled") === "true",

  // Toggle sound functionality
  toggledSound: () => {
    const newSoundState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newSoundState.toString());
    set({ isSoundEnabled: newSoundState });
  },

  // Set active tab
  setactiveTab: (tab) => set({ activeTab: tab }),

  // Set selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Get all contacts (users)
  getallContacts: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/api/v1/message/contacts");
      if (res.data.success) {
        set({ allContacts: res.data.users, isUsersLoading: false });
      } else {
        set({ error: res.data.message, isUsersLoading: false });
      }
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch contacts",
        isUsersLoading: false,
      });
    }
  },

  // Get chat partners
  getMychatPartners: async () => {
    set({ isUsersLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/api/v1/message/chats");
      if (res.data.success) {
        set({ chats: res.data.chatpatners, isUsersLoading: false });
      } else {
        set({ error: res.data.message, isUsersLoading: false });
      }
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch chat partners",
        isUsersLoading: false,
      });
      toast.error(error.response?.data?.message);
    }
  },

  // Get messages
  getMessages: async (userId) => {
    set({ isMessagesLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/v1/message/${userId}`);
      if (res.data.success) {
        set({ messages: res.data.messages, isMessagesLoading: false });
      } else {
        set({ error: res.data.message, isMessagesLoading: false });
      }
    } catch (error) {
      set({
       
        error:
          error.response?.data?.message || "Failed to fetch messages",
        isMessagesLoading: false,
       
      });
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    }
  },

  // Send message
  // sendMessage: async (receiverId, messageData) => {
  //   set({ error: null });
  //   try {
  //     const res = await axiosInstance.post(
  //       `/api/v1/message/send/${receiverId}`,
  //       messageData
  //     );
  //     if (res.data.success) {
  //       const newMessage = res.data.newMessage;
  //       set((state) => ({
  //         messages: [...state.messages, newMessage],
  //       }));
  //       return { success: true, message: newMessage };
  //     } else {
  //       set({ error: res.data.message });
  //       return { success: false, error: res.data.message };
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "Failed to send message";
  //     set({ error: errorMessage });
  //     return { success: false, error: errorMessage };
  //   }
  // },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get()
    const { authUser } = useAuthstore.getState()
    
    if (!selectedUser?._id) {
      toast.error("Please select a user to send message")
      return
    }

    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser.id || authUser._id, // Backend returns 'id' not '_id'
      reciverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isSending: true
    }
    
    // Immediately add the message to UI (optimistic update)
    set((state) => ({
      messages: [...state.messages, optimisticMessage]
    }))

    try {
      const res = await axiosInstance.post(`/api/v1/message/send/${selectedUser._id}`, messageData)
      if (res.data.success && res.data.newMessage) {
        // Replace the optimistic message with the real one from server
        // But first check if socket already added it
        set((state) => {
          const realMessageId = res.data.newMessage._id?.toString()
          
          // Check if real message already exists (socket might have added it)
          const alreadyExists = state.messages.some(msg => {
            const msgId = msg._id?.toString()
            return msgId === realMessageId && msgId !== tempId
          })
          
          if(alreadyExists) {
            // Socket already added it, just remove the optimistic one
            return {
              messages: state.messages.filter(msg => msg._id !== tempId)
            }
          } else {
            // Replace optimistic with real message
            return {
              messages: state.messages.map(msg => 
                msg._id === tempId ? res.data.newMessage : msg
              )
            }
          }
        })
      } else {
        // Remove optimistic message on failure
        set((state) => ({
          messages: state.messages.filter(msg => msg._id !== tempId)
        }))
        toast.error(res.data.message || "Failed to send message")
      }
    } catch (error) {
      // Remove optimistic message on error
      set((state) => ({
        messages: state.messages.filter(msg => msg._id !== tempId)
      }))
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  },

  subscribeMessages:()=>{
    const {selectedUser,isSoundEnabled}=get()
    if(!selectedUser) return;
    const socket=useAuthstore.getState().socket;
    if(!socket) return;
    
    // Remove any existing listeners first to prevent duplicates
    socket.off("newMessage")
    
    const handleNewMessage = (newMessage)=>{
      // Use get() to get latest state every time
      const state = get()
      const currentSelectedUser = state.selectedUser
      const currentMessages = state.messages
      
      // Only add message if it's for the currently selected user
      if(!currentSelectedUser || !newMessage) return;
      
      const {authUser} = useAuthstore.getState()
      
      // Normalize IDs for comparison
      const normalizeId = (id) => {
        if (!id) return null
        if (typeof id === 'object' && id.toString) return id.toString()
        return String(id).trim()
      }
      
      const newSenderId = normalizeId(newMessage.senderId)
      const newReceiverId = normalizeId(newMessage.reciverId)
      const currentUserId = normalizeId(currentSelectedUser._id)
      const authUserId = normalizeId(authUser?.id || authUser?._id) // Backend returns 'id' not '_id'
      const newMessageId = normalizeId(newMessage._id)
      
      // Check if message is for current chat
      const isForCurrentChat = (
        newSenderId === currentUserId || 
        newReceiverId === currentUserId
      )
      
      if(!isForCurrentChat) return
      
      // Check if message already exists using latest state
      const messageExists = currentMessages.some(msg => {
        const msgId = normalizeId(msg._id)
        // Exact ID match - this is the primary check
        return msgId && newMessageId && msgId === newMessageId
      })
      
      if(!messageExists){
        // Use functional update to ensure we're working with latest state
        set((state) => {
          // Double-check again with latest state
          const latestMessages = state.messages
          const stillExists = latestMessages.some(msg => {
            const msgId = normalizeId(msg._id)
            return msgId && newMessageId && msgId === newMessageId
          })
          
          if(stillExists) {
            return state // Don't update if it exists
          }
          
          return {
            messages: [...latestMessages, newMessage]
          }
        })
        
        // Play notification sound if enabled and message is not from current user
        if(isSoundEnabled && newSenderId !== authUserId){
          notiFicationSound.currentTime = 0
          notiFicationSound.play().catch(err => console.log("Audio play failed:", err))
        }
      }
    }
    
    socket.on("newMessage", handleNewMessage)
  },

  unsubcribeMessages:()=>{
    const socket=useAuthstore.getState().socket;
    if(!socket) return;
    socket.off("newMessage")
  },


  // Clear error
  clearError: () => set({ error: null }),

  // Clear messages
  clearMessages: () => set({ messages: [] }),

  

  // Reset store
  resetStore: () =>
    set({
      allContacts: [],
      chats: [],
      messages: [],
      activeTab: "chats",
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
      error: null,
    }),
}));
