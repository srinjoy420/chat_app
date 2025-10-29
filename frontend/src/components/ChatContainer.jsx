import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthstore } from '../store/useauthstore'
import ChatHader from './ChatHader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceHolder'


export const ChatContainer = () => {
  const {setSelectedUser,getMessages,messages,selectedUser}=useChatStore()
  const {authUser}=useAuthstore()
  useEffect(()=>{
    getMessages(selectedUser._id)
  },[selectedUser,getMessages])
  return (
    <>
      <ChatHader/>
      <div className='flex-1 px-6 overflow-y-auto py-8'>
       {messages.length > 0 ? (
        <p>some messages</p>
       ) : (
        <NoChatHistoryPlaceholder name={selectedUser.username}/>
       ) }

      </div>
    </>
  )
}
