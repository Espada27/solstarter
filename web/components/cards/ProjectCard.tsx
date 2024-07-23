"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSolstarterProgram } from '../solstarter/solstarter-data-access'
import { getProgressPercentage, getSolFromLamports, millisecondsToDays, truncateString } from '@/utils/utilsFunctions'
import FallbackImage from '../displayElements/FallbackImage'

type Props = {
    project:Project
    projectAccountPubkey:string
}

const ProjectCard = (props: Props) => {
  //* GLOBAL STATE
  const {usersAccounts} = useSolstarterProgram();

  //* LOCAL STATE
  const progressPercentage = getProgressPercentage(props.project.raisedAmount, props.project.goalAmount);
  const [projectOwner, setProjectOwner] = React.useState<User | null>(null);
  const endTime = new Date(Number(props.project.endTime) * 1000);
  const dayTimeLeft = millisecondsToDays(endTime.getTime() - Date.now());

  const remainingTimeBadge = dayTimeLeft>0 ? `${dayTimeLeft} jours restants` : "Terminé"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersAccounts.data]);

  return (
    <div className='flex items-stretch dark:bg-gradient-custom-gray bg-gradient-custom-gray-dark p-[2px] rounded-xl w-[424px]'>
      <Link 
        href={{
          pathname:`/projects/${props.projectAccountPubkey}`,
          query:{
            projectId:props.projectAccountPubkey.toString()
          }
        }} 
        className='flex flex-col justify-start items-start '
      >
          <div className='w-[420px] h-[230px] relative'>
            <div className={`absolute flex rounded-full ${remainingTimeBadge === "Terminé" ? "bg-gray-400/70 text-gray-800" : "bg-green-200/80 text-green-800"  }    text-sm font-semibold px-3 py-1 bottom-2 left-2`}>{remainingTimeBadge}</div>
            <div className='absolute flex justify-center items-center gap-1 rounded-full  bg-accentColor/80 text-white text-sm font-semibold px-3 py-1 bottom-2 right-2'>{getSolFromLamports(props.project.goalAmount).toString()} 
              <Image alt="sol" src={'/images/logo_sol_white.png'} width={15} height={15}/> 
            </div>
              <FallbackImage 
                alt='project image' 
                fallbackImageSrc='/images/default_project_image.jpg' 
                height={230} width={420} 
                src={props.project.imageUrl}
                classname='object-cover aspect-video rounded-t-xl'
              />
          </div>
          {/* barre de progression */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 z-0">
            <div className="bg-green-600 h-1.5" style={{width: `${Math.min(progressPercentage, 100)}%`}}></div>
          </div>
          {/* info */}
          <div className='bg-white flex flex-col z-10 w-full h-1/4 jus p-2 rounded-b-xl'>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl text-textColor-main'>{truncateString(props.project.name,35) }</h3>
              <p className='text-textColor-second'> {progressPercentage}%</p>
            </div>
            <p className='text-textColor-second'>Par : {projectOwner?.name}</p>
          </div>
      </Link>
    </div>

  )
}

export default ProjectCard