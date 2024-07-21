"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSolstarterProgram } from '../solstarter/solstarter-data-access'
import { getProgressPercentage } from '@/utils/utilsFunctions'

type Props = {
    project:Project
    projectAccountPubkey?:string
}

const ProjectCard = (props: Props) => {
  //* GLOBAL STATE
  const {usersAccounts} = useSolstarterProgram();

  //* LOCAL STATE
  const progressPercentage = getProgressPercentage(props.project.raisedAmount, props.project.goalAmount);
  const [projectOwner, setProjectOwner] = React.useState<User | null>(null);

  // fetch project owner
  useEffect(() => {
    const fetchProjectOwner = ()=>{
      const owner = usersAccounts.data?.find((user)=> user.publicKey.equals(props.project.userPubkey));

      if(owner){
        setProjectOwner(owner.account as User);
      }
    }

    if (usersAccounts.data){
      fetchProjectOwner();
    }
  }, [usersAccounts.data]);

  //* TEST
  // console.log("userToDisplay",userToDisplay);
  // console.log("usersAccounts",usersAccounts.data);
  // console.log("props.project",props.project);
  
  return (
    <div className='flex items-stretch dark:bg-gradient-custom-gray bg-gradient-custom-gray-dark p-[2px] rounded-xl'>
      <Link href={`/projects/${props.projectAccountPubkey}`} className='flex flex-col justify-start items-start '>
          <div className='w-[420px] h-[230px]'>
              <Image src={props.project.imageUrl} alt='project image' width={420} height={230}  className='object-cover aspect-video rounded-t-xl' />
          </div>
          {/* barre de progression */}
          <div className="w-full bg-gray-200 dark:bg-gray-700">
            <div className="bg-green-600 h-1.5" style={{width: `${progressPercentage}%`}}></div>
          </div>
          {/* info */}
          <div className='bg-white flex flex-col z-10 w-full p-2 rounded-b-xl'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl text-textColor-main'>{props.project.name}</h3>
              <p className='text-textColor-second'> {progressPercentage}%</p>
            </div>
            <p className='text-textColor-second'>Par : {projectOwner?.name}</p>
          </div>
      </Link>
    </div>

  )
}

export default ProjectCard