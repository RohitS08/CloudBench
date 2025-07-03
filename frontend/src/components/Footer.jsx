import React from 'react';
import { Link } from 'react-router';

function Footer() {
    return (
        <footer className="bg-[#0d1117] text-[#9ccfd8] py-12 px-6 sm:px-12 lg:px-24 font-mono">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

                {/* About Section */}
                <div>
                    <h4 className="text-xl font-bold text-[#00FFAB] mb-4">About CloudBench</h4>
                    <p className="text-[#7f8f9f] mb-6">
                        Empowering developers with secure, scalable cloud terminals —  
                        anytime, anywhere, on any device. Where innovation meets your workflow.
                    </p>
                    <Link
                        to="/auth/register"
                        className="inline-block px-6 py-2 bg-[#00FFAB] rounded-full text-black font-semibold hover:bg-[#3DF5F5] transition"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-xl font-bold text-[#00FFAB] mb-4">Quick Links</h4>
                    <ul className="space-y-3 text-[#7f8f9f]">
                        <li><Link to="/" className="hover:text-[#00FFAB] transition">Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#00FFAB] transition">About</Link></li>
                        <li><Link to="/contact" className="hover:text-[#00FFAB] transition">Contact Us</Link></li>
                        <li><Link to="" className="hover:text-[#00FFAB] transition">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h4 className="text-xl font-bold text-[#00FFAB] mb-4">Contact & Connect</h4>
                    <p className="mb-3 text-[#7f8f9f]">
                        Email: <a href="mailto:rohitsinghmhkr@gmail.com" className="hover:text-[#00FFAB] transition">rohitsinghmhkr@gmail.com</a>
                    </p>
                    <p className="mb-6 text-[#7f8f9f]">Phone: +91 85919 92134</p>
                </div>
            </div>

            <div className="mt-12 border-t border-[#1f2a37] pt-6 text-center text-[#5a717d] text-sm select-none">
                &copy; 2025 <span className="text-[#00FFAB] font-semibold">CloudBench</span> Inc. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
