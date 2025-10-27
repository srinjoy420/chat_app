import React from 'react'
import { useAuthstore } from '../store/useauthstore'
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import { useChatStore } from '../store/useChatStore'

import {ActiveTabSwitch} from "../components/ActiveTabSwitch"
import {ChatContainer} from "../components/ChatContainer"
import ProfileHeader from "../components/ProfileHeader"
import ChatList from "../components/ChatList"
import ContactList from "../components/ContactList"

import NoConversationPlaceholder from '../components/NoconverSactionPlaceHolder'

const Chatpage = () => {
  const {logout}=useAuthstore()
  const {activeTab,selectedUser}=useChatStore()
  return (
    <div className="text-white  relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* left side */}
        <div className='w-80 bg-slate-800 backdrop-blur-sm flex flex-col'>
          <ProfileHeader/>
          <ActiveTabSwitch/>

          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {activeTab==="chats"  ? <ChatList/> :<ContactList/>}

          </div>
            
        
        </div>
        {/* right side  */}
        <div className='flex-1 flex flex-col bg-slate-900/5 backdrop-blur-sm'>
            {selectedUser ? <ChatContainer/> :<NoConversationPlaceholder/>}
        </div>
      </BorderAnimatedContainer>
     
      
    </div>
  )
}

export default Chatpage