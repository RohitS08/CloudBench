import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from './../components/Header'
import Footer from '../components/Footer'

function MainLayout() {
    return (
        <>
            <Header />
            <div className='flex flex-col min-h-screen'> {/* To Make the mid-section(Body) fill the screen */}
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default MainLayout