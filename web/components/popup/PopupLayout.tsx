import React, { ReactNode } from 'react'

type Props = {
    children : ReactNode
    padding:string
    justify:string
    item:string
}

const PopupLayout = (props: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-40 p-10">
        <div className={`flex flex-col justify-${props.justify} items-${props.item} gap-8 p-${props.padding} rounded-md bg-customGray-900 `}>
            {props.children}
        </div>
    </div>
  )
}

export default PopupLayout