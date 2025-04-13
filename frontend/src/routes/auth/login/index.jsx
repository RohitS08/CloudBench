import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../util/authContext';
import { useLogin } from '../../../util/isLoggedin';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {accessToken, setAccessToken} = useAuth();
    const { setIsLoggedIn } = useLogin();

    useEffect(() => {
        document.title = 'Login - Cloud Terminal'
    }, []);

    const handleInput = (e) => {
        let target = e.target;
        switch (target.name) {
            case 'email':
                setEmail(target.value);
                break;
            case 'password':
                setPassword(target.value);
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email,  password })
        })
        .then( res => res.json())
        .then(data => {
            if(data.status ==='success'){
                setAccessToken(data.accessToken);
                setIsLoggedIn(true);
                return navigate('/');
            }else{
                throw new Error(data.message);
            }
        })
        .catch(err => console.log(err))
    }
    return (
        <div className='flex-grow bg-[#131C24] py-20'>
            <div className='container sm:max-w-[450px] mx-auto'>
            <span className='font-bold text-white text-3xl'>Sign in to your Cloud {accessToken}Terminal account</span>
                <div className='mt-4 max-w-[400px]'>
                     <form onSubmit={handleSubmit} className='mx-auto flex flex-col gap-4'>
                         <div>
                             <label htmlFor="email" className='text-white text-xl'>Email</label>
                             <input type="email" id="email" name="email" placeholder='Email' value={email} onChange={handleInput} className='w-full p- bg-[#1D2A36] p-2 rounded-lg border border-[#32415D] text-white focus:outline focus:outline-[#82c46d]' />
                         </div>

                         <div>
                             <label htmlFor="password" className='text-white text-xl'>Password</label>
                             <input type="password" id="password" name="password" placeholder='Password' value={password} onChange={handleInput} className='w-full p- bg-[#1D2A36] p-2 rounded-lg border border-[#32415D] text-white focus:outline focus:outline-[#82c46d]' />
                         </div>

                         <div className='py-4'>
                             <input type="submit" value="Sign in" className='w-full bg-[#F4C753] p-2 rounded-lg text-black cursor-pointer hover:bg-[#ffdb80] text-xl font-bold' />
                         </div>
                     </form>
                 </div>
            </div>
        </div>
    )
}

export default Login