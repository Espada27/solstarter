import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    project:Project
}

const ProjectCard = (props: Props) => {
  const progressPercentage = (props.project.raised_amount / props.project.goal_amount) * 100;


  return (
    <Link href={`/project/${props.project.pubkey}`} className='flex flex-col justify-start items-start  '>
        <div className='w-[420px] h-[230px] bg-green-400'>
            <Image src={props.project.image_url} alt='project image' width={420} height={230}  className='object-cover aspect-video' />
        </div>
        {/* barre de progression */}
        <div className='w-full bg-gray-200 h-1 relative'>
          <div
            className='bg-green-500 h-4 absolute'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {/* info */}
        <div className='bg-white flex flex-col z-10 w-full p-2'>
          <h3 className='text-xl text-textColor-main'>{props.project.name}</h3>
          <p className='text-textColor-second'>Par : XXXX</p>

        </div>
    </Link>
  )
}

export default ProjectCard