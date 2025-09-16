import React from 'react'
import Navbar from './components/Navbar'
import SettingsPage from './pages/SettingsPage'
import Updateprofilepage from './pages/Updateprofilepage'
import SingupPage from './pages/SingupPage'
import Loginpage from './pages/Loginpage'

import { Routes,Router, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProtectedRoute from './utils/ProtectedRoute'



const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/login' element={<Loginpage/>}/>
      </Routes>
    </div>
  )
}

export default App