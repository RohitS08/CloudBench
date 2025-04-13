import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../assets/Header';

function layout({ children }) {
  return (
    <>
        <div className='flex flex-col min-h-screen'> 
            <Header />
            {children || <Outlet />}
        </div>
    </>

  )
}

export default layout