import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UserLoadingScalitan'
import NoChatsFound from './NoChatsFound'

const ChatList = () => {
  const { getMychatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore()

  useEffect(() => {
    getMychatPartners()
  }, [getMychatPartners])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  if (chats.length === 0) return <NoChatsFound />
  return (
    <>
      {
        chats.map(chat => (
          <div key={chat._id}
            className='bg-cyan-500/10 rounded-lg cursor-pointer hover:bg-cyan-500/20'
            onClick={() => setSelectedUser(chat)}>
            <div className="flex items-center gap-3">
            {/* we will make this using socket.io and make this realtime */}
              <div className="avatar offline">
                <div className="size-12 rounded-full">
                  <img src={chat.profilepic || "/avatar.png"} alt={chat.username} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{chat.username}</h4>
            </div>

          </div>
        ))
      }

    </>
  )
}

export default ChatList