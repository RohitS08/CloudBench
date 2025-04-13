import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleInput = (e) => {
        let elmName = e.target.name;
        switch (elmName) {
            case 'username':
                setUsername(e.target.value);
                break;
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status==='success'){
                return navigate('/auth/login');
            }else{
                throw new Error(data.message);
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        document.title = 'Register - Cloud Terminal'
    }, [])

    return (
        <div className='flex-grow bg-[#131C24] py-20'>
            <div className='container sm:max-w-[450px] mx-auto'>
                <span className='font-bold text-white text-3xl'>Register a new account</span>
                <div className='mt-4 max-w-[400px]'>
                    <form onSubmit={handleSubmit} className='mx-auto flex flex-col gap-4'>
                        <div>
                            <label htmlFor="username" className='text-white text-xl'>Username : </label>
                            <input type="text" id="username" name="username" placeholder='username' value={username} onChange={handleInput} className='w-full p- bg-[#1D2A36] p-2 rounded-lg border border-[#32415D] text-white focus:outline focus:outline-[#82c46d]' />
                        </div>
                        <div>
                            <label htmlFor="email" className='text-white text-xl'>Email : </label>
                            <input type="email" id="email" name="email" placeholder='email' value={email} onChange={handleInput} className='w-full p- bg-[#1D2A36] p-2 rounded-lg border border-[#32415D] text-white focus:outline focus:outline-[#82c46d]' />
                        </div>
                        <div>
                            <label htmlFor="password" className='text-white text-xl'>Password</label>
                            <input type="password" id="password" name="password" placeholder='Password' value={password} onChange={handleInput} className='w-full p- bg-[#1D2A36] p-2 rounded-lg border border-[#32415D] text-white focus:outline focus:outline-[#82c46d]' />
                        </div>

                        <div className='py-4'>
                            <input type="submit" value="Sign Up" className='w-full bg-[#F4C753] p-2 rounded-lg text-black cursor-pointer hover:bg-[#ffdb80] text-xl font-bold' />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register