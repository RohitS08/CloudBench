import React from 'react'
import { Link } from 'react-router'
import { useLogin } from '../util/isLoggedin';
function Header() {
    const { isLoggedIn } = useLogin();
    return (
        <header className='border-b border-[#484e53]'>
            <nav className="bg-[#131C24] p-2 flex justify-between">
                <div>
                    <span className='text-white text-3xl pl-4'>AnyTech</span>
                </div>
                <div className='pr-4'>
                    <ul className="flex">
                        <li className=" mx-1 text-white p-2 text-l font-thin hover:text-sky-700"><Link to='/'>Home</Link></li>
                        <li className=" mx-1 text-white p-2 text-l font-thin hover:text-sky-700"><Link to='/about'>About</Link></li>
                        <li className=" mx-1 text-white p-2 text-l font-thin hover:text-sky-700"><Link to='/contact'>Contact</Link></li>
                        {isLoggedIn ? (
                            <li className=" mx-1 text-white p-2 text-l font-thin hover:text-sky-700"><Link to='/auth/logout'>Logout</Link></li>
                        ) : (
                            <>
                                <li className="mx-1 text-white p-2 text-l font-thin hover:text-sky-700"><Link to='/auth/login'>Login</Link></li>
                                <li className="mx-1 text-[#62BBC1] p-2 text-l font-thin rounded-xl bg-[#466365] hover:bg-[#62BBC1] hover:text-[#FFFBFC]"><Link to='/auth/register'>Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default Header