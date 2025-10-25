import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
    }
  },

  // Send message
  sendMessage: async (receiverId, messageData) => {
    set({ error: null });
    try {
      const res = await axiosInstance.post(
        `/api/v1/message/send/${receiverId}`,
        messageData
      );
      if (res.data.success) {
        const newMessage = res.data.newMessage;
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
        return { success: true, message: newMessage };
      } else {
        set({ error: res.data.message });
        return { success: false, error: res.data.message };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send message";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    }
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
