import React from 'react'

type Props = {
    label:string
}

const SecondaryButtonLabel = (props: Props) => {
  return (
    <div className='flex justify-center items-center bg-white dark:bg-black border border-black dark:border-white text-h3 px-2 py-4 text-center'>{props.label.toUpperCase()}</div>
  )
}

export default SecondaryButtonLabel