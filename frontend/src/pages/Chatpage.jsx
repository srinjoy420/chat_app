import React from 'react'
import { useAuthstore } from '../store/useauthstore'

const Chatpage = () => {
  const {logout}=useAuthstore()
  return (
    <div className="text-white text-3xl">
      chatpage
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Chatpage