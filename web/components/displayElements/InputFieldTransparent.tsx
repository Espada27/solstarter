import React from 'react'

type Props = {
    value:string
    placeholder:string
    onchange:(e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFieldTransparent = (props: Props) => {
  return (
    <input
        className='bg-transparent border border-black dark:border-white w-full md:w-1/2 text-body-style  p-2 rounded-full'
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onchange}
    />
  )
}

export default InputFieldTransparent