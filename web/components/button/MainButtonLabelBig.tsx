import React from 'react'
import { Audiowide} from "next/font/google";

const audioWide = Audiowide({weight: '400',subsets: ['latin']});

type Props = {
    label:string
    isDisabled?:boolean
}

const MainButtonLabelBig = (props: Props) => {
  return (
    <div className={`${audioWide.className} flex justify-center items-center rounded-full ${props.isDisabled? "bg-secondColor dark:bg-neutral-600 opacity-50":"bg-accentColor  hover:bg-accentColor/50"}  text-2xl text-white  text-center px-2 py-4 transition-all`}>{props.label}</div>
  )
}

export default MainButtonLabelBig