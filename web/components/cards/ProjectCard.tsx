"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useSolstarterProgram } from '../solstarter/solstarter-data-access'
import { getProgressPercentage, getSolFromLamports, millisecondsToDays } from '@/utils/utilsFunctions'

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
  const endTime = new Date(Number(props.project.endTime) * 1000);
  const dateNow = new Date();
  const dayTimeLeft = millisecondsToDays(endTime.getTime() - dateNow.getTime());

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
    <div className='flex items-stretch dark:bg-gradient-custom-gray bg-gradient-custom-gray-dark p-[2px] rounded-xl'>
      <Link href={`/projects/${props.projectAccountPubkey}`} className='flex flex-col justify-start items-start '>
          <div className='w-[420px] h-[230px] relative'>
            <div className='absolute flex badge bg-amber-200 border border-2 border-amber-800 border-solid bg-opacity-80 text-amber-800 text-sm font-semibold gap-2 p-3 bottom-2 left-2'>{dayTimeLeft.toString()} jours restants</div>
            <div className='absolute flex badge bg-indigo-200 border border-2 border-indigo-600 border-solid bg-opacity-80 text-indigo-800 text-sm font-semibold p-3 bottom-2 right-2'>{getSolFromLamports(props.project.goalAmount).toString()} SOL</div>
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