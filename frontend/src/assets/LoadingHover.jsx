import React from 'react'

function Loading_Duck({ message }) {
    return (
        <>
            <div className='absolute top-0 left-0 w-full h-full z-[1000] flex items-center justify-center bg-black/30'>
                <div className='flex flex-col items-center'>
                    <img className='mx-auto w-[200px]' src='/images/green.gif' />
                    <span className='text-white'>{ message }</span>
                </div>
            </div>
        </>
    )
}

export default Loading_Duck