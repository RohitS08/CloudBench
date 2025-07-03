import React, { useState } from 'react';
import { Link } from 'react-router';
import { Toaster } from 'react-hot-toast';

import { FaBars, FaTimes } from 'react-icons/fa';

import { useLogin } from '../util/isLoggedin';

function Header() {
    const { isLoggedIn } = useLogin();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header className="border-b border-[#2ea043] bg-[#0d1117] shadow-lg sticky top-0 z-50 font-mono">
            <Toaster
                toastOptions={{
                    style: {
                        background: '#161b22',
                        color: '#3DF5F5',
                        fontFamily: 'monospace',
                    },
                    iconTheme: {
                        primary: '#00FFAB',
                        secondary: '#0d1117',
                    },
                }}
            />

            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                {/* Logo */}
                <div>
                    <Link
                        to="/"
                        className="relative inline-block text-2xl sm:text-3xl font-mono text-[#00FFAB] hover:text-[#3DF5F5] transition-colors duration-300 group"
                        aria-label="Go to homepage"
                    >
                        CloudBench
                        <span className="absolute left-full top-0 h-full w-1 bg-[#00FFAB] opacity-0 group-hover:opacity-100 animate-pulse rounded-r"></span>
                    </Link>
                </div>

                {/* Hamburger Menu Icon */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-[#00FFAB] text-2xl focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center space-x-6 text-[#C3F3D9] text-base tracking-wide select-none">
                    {navLinks.map(({ name, path }) => (
                        <li key={name} className="relative group">
                            <Link
                                to={path}
                                className="hover:text-[#00FFAB] transition-colors duration-300"
                            >
                                {name}
                            </Link>
                            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#00FFAB] transition-all duration-500 group-hover:w-full rounded"></span>
                        </li>
                    ))}

                    {isLoggedIn ? (
                        <li className="relative group">
                            <Link
                                to="/auth/logout"
                                className="hover:text-[#00FFAB] transition-colors duration-300"
                            >
                                Logout
                            </Link>
                            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#00FFAB] transition-all duration-500 group-hover:w-full rounded"></span>
                        </li>
                    ) : (
                        <>
                            <li className="relative group">
                                <Link
                                    to="/auth/login"
                                    className="hover:text-[#00FFAB] transition-colors duration-300"
                                >
                                    Login
                                </Link>
                                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#00FFAB] transition-all duration-500 group-hover:w-full rounded"></span>
                            </li>
                            <li>
                                <Link
                                    to="/auth/register"
                                    className="inline-block rounded-xl bg-[#00FFAB] px-5 py-2 text-black font-bold hover:bg-[#3DF5F5] transition-colors duration-300 shadow-md"
                                >
                                    Get Started
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#0d1117] px-6 pb-4 text-[#C3F3D9] text-base">
                    <ul className="space-y-3">
                        {navLinks.map(({ name, path }) => (
                            <li key={name}>
                                <Link
                                    to={path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block hover:text-[#00FFAB] transition-colors duration-300"
                                >
                                    {name}
                                </Link>
                            </li>
                        ))}

                        {isLoggedIn ? (
                            <li>
                                <Link
                                    to="/auth/logout"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block hover:text-[#00FFAB] transition-colors duration-300"
                                >
                                    Logout
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/auth/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block hover:text-[#00FFAB] transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/auth/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block rounded-xl bg-[#00FFAB] px-4 py-2 text-black font-bold hover:bg-[#3DF5F5] transition-colors duration-300 shadow-md"
                                    >
                                        Get Started
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </header>
    );
}

export default Header;
