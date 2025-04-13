import { useState } from 'react'
import { useAuth } from '../util/authContext';

function Card_NewSession({ onClose }) {
    const {accessToken, setAccessToken} = useAuth();
    const [newSessionData, setNewSessionData] = useState({
        session_type: 'NodeJs'
    });

    const handleChange = (e) => {
        setNewSessionData({...newSessionData, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        fetch(`${import.meta.env.VITE_API_URL}/sessions/new`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken, session_type: 'NodeJs' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Session started successfully');
                onClose(); // Close the modal after starting the session
            } else {
                throw new Error(data.message);
            }
        })
        .catch(err => {
            console.error('Error starting session:', err);
            alert('Failed to start session. Please try again.');
        })
    }

    return (
        <>
            <div className='absolute top-0 left-0 w-full h-full z-[999] flex items-center justify-center bg-black/30'>
                <div className="text-black bg-white px-4 z-[1000]">
                    <div>
                        <button className='text-2xl bold ml-auto block' onClick={onClose}>&times;</button>
                    </div>
                    <div className='border p-4'>
                        <label htmlFor='session_type'>Session Type : </label>
                        <select id='session_type' name='session_type' value={newSessionData.session_type} onChange={handleChange}>
                            <option value="NodeJs">NodeJs</option>
                            <option value="Python">Python</option>
                            <option value="Linux">Linux</option>
                        </select>

                        <span onClick={handleSubmit} className='py-2 px-4 bg-[#23ac23] block w-min cursor-pointer rounded hover:bg-[#60ad60]'>Run</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card_NewSession