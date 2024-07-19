'use client'

import Link from 'next/link'
import
React from 'react'



const ErrorYourDomains = () => {
  return (
    <Link href='/'>
      <div className='m-10 p-5 rounded-full border border-red-700 text-red-500 hover:bg-red-300 transition-all duration-300 text-center'>Solstarter à du mal à partir...Retourner à la page d&apos;accueil</div>
    </Link>
  )
}

export default ErrorYourDomains