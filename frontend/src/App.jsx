import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './components/Dashboard'
import About from './components/About'
import ContactUs from './components/ContactUs'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Logout from './components/auth/Logout'
import Error404 from './components/Error404'
import TerminalPage from './components/session/TerminalPage'

import MainLayout from './layouts/MainLayout'
import TerminalLayout from './layouts/TerminalLayout'

import { AuthProvider } from './util/authContext'
import { LoginProvider } from './util/isLoggedin'
import LandingPage from './assets/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoginProvider>
            <Routes>
              <Route element={<TerminalLayout />} >
                <Route path='/session/id/:id' element={<TerminalPage />} />
              </Route>
              <Route element={<MainLayout />}>
                <Route path='/' element={<LandingPage />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<ContactUs />} />
                <Route path='/auth/login' element={<Login />} />
                <Route path='/auth/register' element={<Register />} />
                <Route path='/auth/logout' element={<Logout />} />
                <Route path='*' element={<Error404 />} />
              </Route>
            </Routes>
        </LoginProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;