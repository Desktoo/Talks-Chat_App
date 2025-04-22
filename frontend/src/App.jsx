import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { LoaderCircle } from 'lucide-react'
import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'

const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()

  console.log(onlineUsers)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log(authUser)

  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={ authUser ? <Homepage /> : <Navigate to='/login'/>} />
        <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App