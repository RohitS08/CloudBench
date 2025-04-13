import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Error404 from './components/Error404'

import { AuthProvider } from './util/authContext'
import { LoginProvider } from './util/isLoggedin'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginProvider>
          <Header />
          <div className='flex flex-col min-h-screen'> {/* To Make the mid-section(Body) fill the screen */}
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/auth/login' element={<Login />} />
              <Route path='/auth/register' element={<Register />} />
              <Route path='*' element={<Error404 />} />
            </Routes>
          </div>
        </LoginProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;