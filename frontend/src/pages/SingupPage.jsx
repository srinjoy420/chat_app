import React from 'react'
import { useAuthstore } from '../store/useauthstore.js'

const SingupPage = () => {
    const {authUser,isLoading,Login}=useAuthstore()
  return (
    <div>
      <h1 className="text-white text-3xl">efwefe</h1>
    </div>
  )
}

export default SingupPage