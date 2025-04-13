import React from 'react'
import '../main.css';
import LandingPage from '../assets/LandingPage';
import Dashboard from '../assets/Dashboard';
import { useLogin } from '../util/isLoggedin';

function Home() {
  const { isLoggedIn } = useLogin();
  return (
    <>
      {/* {isLoggedIn ? <Dashboard /> : <LandingPage />} */}
      <Dashboard /> {/* For Development purposes */}
    </>
  )
}

export default Home