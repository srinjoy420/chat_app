import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthstore } from '../store/useauthstore'
import ChatHader from './ChatHader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceHolder'
import MessaGeInput from './MessaGeInput'
import MessagesLoadingSkeleton from './MessageLoadingscleTon'


export const ChatContainer = () => {
  const {getMessages,messages,selectedUser,isMessagesLoading}=useChatStore()
  const {authUser}=useAuthstore()
  
  // Helper function to normalize IDs for comparison
  const normalizeId = (id) => {
    if (!id) return null
    return String(id).trim()
  }
  
  const isMyMessage = (msgSenderId) => {
    if (!authUser?.id || !msgSenderId) return false
    return normalizeId(msgSenderId) === normalizeId(authUser.id)
  }

  useEffect(()=>{
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id)
  },[selectedUser?._id,getMessages])
  return (
    <>
      <ChatHader/>
      <div className='flex-1 px-6 overflow-y-auto py-8'>
       {selectedUser && messages.length > 0 && !isMessagesLoading ? (
         <div className='max-w-3xl mx-auto space-y-6'>
           {messages.map(msg=>{
             const myMessage = isMyMessage(msg.senderId)
             return (
              <div key={msg._id}
              className={`chat ${myMessage ? "chat-end":"chat-start"}`}>
                 <div className={
                  `chat-bubble relative  ${
                  myMessage
                   ? "bg-cyan-600 text-white":"bg-slate-800 text-slate-200"}`
                 }>
                   {msg.image &&(
                    <img src={msg.image} alt='shared' className='rounded-lg h-48 object-cover'/>
                   )}
                   {msg.text && <p className={msg.image ? 'mt-2' : ''}>{msg.text}</p>}
                   {/* the date of the message */}
                   <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}                    
                   </p>

                 </div>

              </div>
             )
           })}

         </div>
       ) : isMessagesLoading ? ( <MessagesLoadingSkeleton/>) : selectedUser ? (
        <NoChatHistoryPlaceholder name={selectedUser.username}/>
       ) : null }

      </div>
      <MessaGeInput/>
    </>
  )
}
