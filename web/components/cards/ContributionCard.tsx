'use client'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { useSolstarterProgram } from '../solstarter/solstarter-data-access'
import Image from 'next/image'
import LoaderSmall from '../displayElements/LoaderSmall'
import { getSolFromLamports } from '@/utils/utilsFunctions'

type Props = {
    contributions:Contribution
}

const ContributionCard = (props: Props) => {
    const {projectsAccounts} = useSolstarterProgram();

    const [projectToDisplay,setProjectToDisplay] = useState<AccountWrapper<Project> | null>(null);

    useEffect(() => {
        if (projectsAccounts.data){
            const project = projectsAccounts.data.find((project)=>project.publicKey.equals(props.contributions.projectPubkey));
            
            if(project){
                setProjectToDisplay(project);
            }
        }
    }, [projectsAccounts.data,props.contributions]);

    //* TEST
    console.log("projectToDisplay",projectToDisplay);

    if (!projectToDisplay){
        return <div><LoaderSmall/></div>
    }

    return ( 
        <Link 
            href={`/projects/${props.contributions.projectPubkey.toString()}`} 
            className='flex flex-col justify-start items-start w-[200px]'
        >
            <div className='w-full relative aspect-square'>
                <Image alt='image' src={projectToDisplay.account.imageUrl} fill className=' object-cover rounded-t-xl'/>
            </div>
            <div className='flex flex-col items-start justify-center gap-2 p-2 bg-white h-1/3 rounded-b-xl'>
                <p className='text-textColor-main'>{projectToDisplay.account.name}</p>
                <p className='text-textColor-second'>Ma contrib : {getSolFromLamports(props.contributions.amount).toString() } SOL</p>
            </div>
        </Link>
    )
}

export default ContributionCard