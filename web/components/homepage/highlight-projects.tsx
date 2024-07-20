'use client'
import React, { useEffect, useState } from 'react'
import 'react-multi-carousel/lib/styles.css';
import { useSolstarterProgram } from '../solstarter/solstarter-data-access';
import ProjectCard from '../cards/ProjectCard';

type Props = {
    projects:Project[]
}

const HighlightProjects = (props: Props) => {
    const {projectsAccounts} = useSolstarterProgram();
    const[projectsToDisplay,setProjectsToDisplay] = useState<AccountWrapper<Project>[] | null>(null);

    // Sort the project by raisedAmount and display the 3 most important
    useEffect(() => {
      if (projectsAccounts.data){
        const topRaisedProjects = projectsAccounts.data
            .sort((a,b)=>b.account.raisedAmount - a.account.raisedAmount)
            .slice(0,3)// find the 3 projects wiht raisedAmount the most important
        
        if(topRaisedProjects){
            setProjectsToDisplay(topRaisedProjects as AccountWrapper<Project>[]);
        }
      }
    }, [projectsAccounts.data]);

    //* TEST
    // console.log(projectsToDisplay);
    
    return (
        <div className='flex justify-center items-center w-full min-h-full gap-4 overflow-x-auto md:overflow-x-hidden'>
            {projectsToDisplay && projectsToDisplay.map((project, index) => (
                <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
            ))}
        </div>
    )
}

export default HighlightProjects
