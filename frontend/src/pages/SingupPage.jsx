import React, { useState } from 'react'
import { useAuthstore } from '../store/useauthstore.js'
import { Link, Navigate } from "react-router-dom";
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx'
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";

const SingupPage = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" })
  const { signup, isSigningUp } = useAuthstore()

  const handelSubmit = async(e) => {
    e.preventDefault()
    const result=await signup(formData)
    if(result.success){
      Navigate("/")
    }

   
  }

  return (
    <div className='w-full flex items-center justify-center p-4 bg-slate-900'>
      <div className='relative w-full mx-w-6xl md:h-[800px] h-[650px]'>
        <BorderAnimatedContainer>
          <div className='w-full flex flex-col md:flex-row'>
            {/* from will get left side */}
            <div className="md:w-1/2 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-600/30 md:h-[600px] h-[500px]">


              <div className='w-full max-w-md'>
                {/* the message circle icon and the title */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>
                {/* form */}
                <form onSubmit={handelSubmit} className='space-y-6'>
                {/* Full name */}
                  <div>
                    <label className="auth-input-label">Full name</label>
                    {/* the input */}
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />

                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="auth-input-label">Email</label>
                    {/* the input */}
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="sg@gmail.com"
                      />

                    </div>
                  </div>
                  {/* Password */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    {/* the input */}
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder='****'
                        
                      />

                    </div>
                  </div>

                  {/* button section */}
                  <button className='auth-btn' type='submit' disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>


                </form>
                {/* if already have an accoutnt then redirect to login page */}
                 
                 <div className='mt-6 text-center'>
                   <Link to="/login" className='auth-link'>already have an account?Go to login page</Link>
                 </div>


              </div>

            </div>

          </div>
        </BorderAnimatedContainer>
      </div>

    </div>
  )
}

export default SingupPage