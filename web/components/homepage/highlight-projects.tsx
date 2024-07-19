'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useSolstarterProgram } from '../solstarter/solstarter-data-access';
import { extractAccountsData } from '@/utils/utilsFunctions';
import ProjectCard from '../cards/ProjectCard';

type Props = {
    projects:Project[]
}

const HighlightProjects = (props: Props) => {
    const {projectsAccounts} = useSolstarterProgram();
    const[projectsToDisplay,setProjectsToDisplay] = useState<Project[]>([]);

    // extract data from the program accounts
    useEffect(() => {
      if (projectsAccounts.data){
        const projectsData = extractAccountsData<Project>(projectsAccounts.data as AccountWrapper<Project>[]);
        setProjectsToDisplay(projectsData.slice(0,3));
      }
    }, [projectsAccounts.data]);

    console.log(projectsToDisplay);
    
    
    return (
        <div className='flex justify-center items-center w-full min-h-full gap-4 overflow-x-auto md:overflow-x-hidden'>
            {projectsToDisplay.map((project:Project, index:any) => (
                <ProjectCard key={index} project={project}/>
            ))}
        </div>
    )
}

export default HighlightProjects
