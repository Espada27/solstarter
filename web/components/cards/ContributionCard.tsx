'use client'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import { useSolstarterProgram } from '../solstarter/solstarter-data-access'
import Image from 'next/image'
import LoaderSmall from '../displayElements/LoaderSmall'
import { getSolFromLamports } from '@/utils/utilsFunctions'
import FallbackImage from '../displayElements/FallbackImage'

type Props = {
    contributions:Contribution
}

const ContributionCard = (props: Props) => {
    const {projectsAccounts} = useSolstarterProgram();

    const [projectToDisplay,setProjectToDisplay] = useState<AccountWrapper<Project> | null>(null);
    const [levelToDisplay,setLevelToDisplay] = useState<string>('');

    useEffect(() => {
        if (projectsAccounts.data){
            const project = projectsAccounts.data.find((project)=>project.publicKey.equals(props.contributions.projectPubkey));
            
            if(project){
                setProjectToDisplay(project);
            }
        }
    }, [projectsAccounts.data,props.contributions]);

    const getContributionLevel = (contributionAmount: number, rewards: Reward[]): string => {
        let level = 'Niveau 1';
        for (let i = 0; i < rewards.length; i++) {
            if (contributionAmount >= rewards[i].rewardAmount) {
                level = `Niveau ${i + 1}`;
            } else {
                break;
            }
        }
        return level;
    };

    useEffect(() => {
        if (projectToDisplay){
            setLevelToDisplay(getContributionLevel(getSolFromLamports(props.contributions.amount), projectToDisplay.account.rewards));
        }
    }, [projectToDisplay]);

    //* TEST
    console.log("projectToDisplay",projectToDisplay);

    if (!projectToDisplay){
        return <div><LoaderSmall/></div>
    }

    return ( 
        <Link 
            href={`/projects/${props.contributions.projectPubkey.toString()}`} 
            className='flex flex-col justify-start items-start w-[200px] relative'
        >
            <div className=
                {`absolute flex rounded-full ${levelToDisplay === "Niveau 1" &&  "bg-green-600/70"} ${levelToDisplay === "Niveau 2" &&  "bg-emerald-600/70"} ${levelToDisplay === "Niveau 3" &&  "bg-teal-600/70"}  text-sm font-semibold gap-2 px-3 py-1 top-2 right-2 z-10`}>{levelToDisplay}</div>
            <div className='w-full relative aspect-square'>
                <FallbackImage 
                    alt='project image' 
                    fallbackImageSrc='/images/default_project_image.jpg' 
                    height={200} width={200} 
                    src={projectToDisplay.account.imageUrl}
                    classname='object-cover rounded-t-xl aspect-square'
                />
                {/* <Image alt='image' src={projectToDisplay.account.imageUrl} fill className=' object-cover rounded-t-xl'/> */}
            </div>
            <div className='flex flex-col items-start justify-center gap-2 p-2 bg-white h-1/3 rounded-b-xl w-full'>
                <p className='text-textColor-main'>{projectToDisplay.account.name}</p>
                <div className='flex justify-start items-center gap-1'>
                    <p className='text-textColor-second'>Montant : {getSolFromLamports(props.contributions.amount).toString() } </p>
                    <Image alt="sol" src={'/images/logo_sol_black.png'} width={15} height={15}/> 
                </div>
                
            </div>
        </Link>
    )
}

export default ContributionCard