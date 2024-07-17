import React from 'react'
import { LuLoader2 } from 'react-icons/lu'


const LoaderSmall = () => {
    return (
        <div className='flex justify-center items-center p-10 '><LuLoader2 className='animate-spin' size={50} style={{ color: '#262626' }} /></div>
    )
}

export default LoaderSmall