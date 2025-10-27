import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UserLoadingScalitan'
import NoChatsFound from './NoChatsFound'


const ContactList = () => {
  const { getMychatPartners, chats, isUsersLoading, setSelectedUser,getallContacts,allContacts } = useChatStore()

   useEffect(() => {
      getallContacts()
    }, [getallContacts])

    if (isUsersLoading) return <UsersLoadingSkeleton />
    if (!allContacts || allContacts.length === 0) return <NoChatsFound />
    
  return (
    <>
      {
        allContacts.map(contact=>(
          <div key={contact._id}
           className='bg-cyan-500/10 rounded-lg cursor-pointer hover:bg-cyan-500/20'
            onClick={() => setSelectedUser(contact)}>
              <div className="flex items-center gap-3">
            {/* we will make this using socket.io and make this realtime */}
              <div className="avatar offline">
                <div className="size-12 rounded-full">
                  <img src={contact.profilepic || "/avatar.png"} alt={contact.username} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium truncate">{contact.username}</h4>
            </div>

            

          </div>
        ))
      }
    </>
  )
}

export default ContactList