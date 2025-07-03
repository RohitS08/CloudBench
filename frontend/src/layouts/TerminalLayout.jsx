import React from 'react'
import { Outlet } from 'react-router-dom'
function TerminalLayout() {
    return (
        <>
            <div className='border border-black'>
                <Outlet />
            </div>
        </>
    )
}

export default TerminalLayout