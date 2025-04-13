import { useEffect, useState } from 'react'
import Card_NewSession from '../assets/Card_NewSession'

function Dashboard() {
    const [showNewSessionCard, setShowNewSessonCard] = useState(true);
    useEffect(() => {
        document.title = 'Dashboard - MyApp'
    }, []);

    const startNewSession = () => {
        // Logic to start a new session
        console.log('Starting a new session...');
    }

    return (
        <>
            <div className='flex-grow bg-[#131C24] text-white py-20'>

                <div className='w-[70%] mx-auto text-center'>
                    <h1 className='text-5xl font-bold'>Welcome back!</h1>
                    <p className='mt-4 text-lg'>You are logged in.</p>
                </div>

                <div className='w-[70%] mx-auto mt-10'>
                    <button onClick={ () => setShowNewSessonCard(true) } className='bg-[#1E90FF] text-white py-2 px-4 rounded mx-auto block'>Start a new session</button>
                    { showNewSessionCard && <Card_NewSession onClose={() => setShowNewSessonCard(false) } /> }
                </div>
            </div>
        </>
    )
}

export default Dashboard