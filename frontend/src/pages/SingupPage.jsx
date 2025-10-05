import React, { useState } from 'react'
import { useAuthstore } from '../store/useauthstore.js'

const SingupPage = () => {
  const[formData,setFormData]=useState({username:"",email:"",password:""})
  const {singup,issSingingUp}=useAuthstore()

  const handelSubmit=(e)=>{

  }
   
  return (
    <div>
      <h1 className="text-white text-3xl">efwefe</h1>
    </div>
  )
}

export default SingupPage