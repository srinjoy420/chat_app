import React from 'react'
import { useAuthstore } from '../store/useauthstore.js'

const Loginpage = () => {
    const {authUser,isLoading,Login}=useAuthstore()
  return (
    <div className="text-white text-3xl">Loginpage</div>
  )
}

export default Loginpage