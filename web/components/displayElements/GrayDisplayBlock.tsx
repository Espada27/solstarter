import React, { ReactNode } from 'react'

type Props = {
    children : ReactNode
    padding:string
}

const GrayDisplayBlock = (props: Props) => {
  return (
    <div className='flex items-stretch w-full dark:bg-gradient-custom-gray bg-gradient-custom-gray-dark p-[1px] rounded-xl'>
        <div className={`flex justify-between w-full items-stretch gap-4 bg-gray-200 dark:bg-gray-900  halo-effect dark:halo-effect-dark rounded-xl p-${props.padding}`}>
            {props.children}
        </div>
    </div>
  )
}

export default GrayDisplayBlock