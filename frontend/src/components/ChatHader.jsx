import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { XIcon } from 'lucide-react'
import { useAuthstore } from '../store/useauthstore'

const ChatHader = () => {
    const { selectedUser, setSelectedUser } = useChatStore()
    const{ onlineUsers }=useAuthstore()
    //we check the selected user is on the onlineuserarray
    const isOnline=onlineUsers.includes(selectedUser._id)
    useEffect(()=>{
        const handleEscKey=event=>{
            if(event.key==="Escape") setSelectedUser(null)
        }
        window.addEventListener("keydown",handleEscKey)
        // cleanup function
        return ()=>window.removeEventListener("keydown",handleEscKey)
    },[setSelectedUser])

    return (
        <div className='flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1'>
            <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className={`avatar ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                    <div className="w-12 rounded-full overflow-hidden ring-2 ring-cyan-500/30">
                        <img
                            src={selectedUser.profilepic || "/avatar.png"}
                            alt={selectedUser.username || "User"}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>

                {/* User Info */}
                <div className="flex flex-col">
                    <h3 className="text-white font-medium text-base">
                        {selectedUser.username || "Loading..."}
                    </h3>
                    <p className="text-cyan-400 text-sm">{isOnline ? "online" : "offline"}</p>
                </div>
            </div>
            <button onClick={()=>setSelectedUser(null)}>
                <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"/>
            </button>

        </div>
    )
}

export default ChatHader