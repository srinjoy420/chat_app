import React from 'react'
import { Route, Routes } from 'react-router'
import Chatpage from './pages/Chatpage'
import Loginpage from './pages/Loginpage'
import SingupPage from './pages/SingupPage'
import { useAuthstore } from './store/useauthstore.js'


const App = () => {
  const { authUser, isLoading, Login,isLoggedIn } = useAuthstore()
  // console.log("authuser", authUser);
   console.log("isloggedin", isLoggedIn);


  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden text-white'>
      {/* Decorators_GRID */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] -z-10" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] -z-10" />

      <button onClick={Login}>Login</button>
      <Routes>
        <Route path='/' element={<Chatpage />} />
        <Route path='/login' element={<Loginpage />} />
        <Route path='/singup' element={<SingupPage />} />


      </Routes>
    </div>
  )
}

export default App