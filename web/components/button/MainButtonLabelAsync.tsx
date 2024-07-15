'use client'
import { useTheme } from 'next-themes'
import React from 'react'
import { LuLoader2 } from 'react-icons/lu'

type Props = {
    label:string
    isDisabled?:boolean
    isLoading:boolean
    loadingLabel?:string
}

const MainButtonLabelAsync = (props: Props) => {
  const {theme} = useTheme()

  return (
    <div className={`flex justify-center items-center ${props.isDisabled? "bg-secondColor dark:bg-neutral-600":"bg-black dark:bg-mainButtonDark"}  text-h3 text-white dark:text-black px-2 py-4 transition-all`}>
      {props.isLoading?
      <div className='flex justify-center items-center gap-2'>
        <p>{props.loadingLabel}</p>
        <p>
          {theme === "light" && <LuLoader2 className='animate-spin' size={30} style={{ color: '#FFFFFF' }} /> }
          {theme === "dark" && <LuLoader2 className='animate-spin' size={30} style={{ color: '#000000' }} /> }
        </p>
      </div>
      :  
      props.label.toUpperCase()}
    </div>
  )
}

export default MainButtonLabelAsync