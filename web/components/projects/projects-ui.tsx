'use client'
import { useEffect, useState } from "react";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import InputFieldTransparent from "../displayElements/InputFieldTransparent";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import { extractAccountsData } from "@/utils/utilsFunctions";
import ProjectCard from "../cards/ProjectCard";

//* FILTERS
type ProjectFilterProps = {
    status: "ongoing" | "closed" | null;
    setStatus: (status: "ongoing" | "closed" | null) => void;
}

export function ProjectFilter(props:ProjectFilterProps){
    return (
        <GrayDisplayBlock padding="4">
            <div className='flex justify-between items-center w-full px-4'>
                <div className='flex justify-start gap-2 w-1/2 '>
                    <input type="radio" id='ongoing' checked={props.status === "ongoing"} onChange={()=>props.setStatus("ongoing")} className='p-2'/>
                    <label className='w-full'>
                    En cours
                    </label>
                    <input type="radio" id='closed' checked={props.status === "closed"} onChange={()=>props.setStatus("closed")}/>
                    <label className='w-full'>
                    Terminée
                    </label>
                    <input type="radio" id='all' checked={props.status === null} onChange={()=>props.setStatus(null)}/>
                    <label className='w-full'>
                    Tous
                    </label>
                </div>
                <div className='flex justify-end w-full'>
                    <InputFieldTransparent value='' placeholder="Non fonctionnel pour l'instant" onchange={()=>{console.log('change')}}/>
                </div>
            </div>
        </GrayDisplayBlock>
    )
}


//* PROJECTS LIST
type ProjectListProps = {
    seletedStatus: "ongoing" | "closed" | null;
}
export function ProjectList(props:ProjectListProps){
    const {projectsAccounts} = useSolstarterProgram();

    const [allProjects, setAllProjects] = useState<AccountWrapper<Project>[]>([]); // use the AccountWrapper type to handle the publicKey
    const [projectsToDisplay, setProjectsToDisplay] = useState<AccountWrapper<Project>[]>([]); // use the AccountWrapper type to handle the publicKey

    // convert the status object to a string to handle the filter
    function getStatusString(status: any): string {
        if (status.draft) return 'draft';
        if (status.ongoing) return 'ongoing';
        if(status.completed) return 'completed';
        if(status.abandoned) return 'abandoned';
        return 'unknown';
    }

    //extract all the projects from the accounts
    useEffect(() => {
        if (projectsAccounts.data){
            setAllProjects(projectsAccounts.data as AccountWrapper<Project>[]);
        }
    }, [projectsAccounts.data]);

    // update project function of selected status
    useEffect(() => {
        if (props.seletedStatus){
            setProjectsToDisplay(allProjects.filter(project  =>getStatusString(project.account.status) === props.seletedStatus));
        } else {
            setProjectsToDisplay(allProjects);
        }
    }, [props.seletedStatus]);

    //* TEST
    // console.log("projectsAccounts",projectsAccounts.data);
    
    return (
        <GrayDisplayBlock padding='4'>
            <div 
                className="grid gap-20  w-full justify-center"
                style={{gridTemplateColumns:"repeat(auto-fit,minmax(420px,auto)"}} // handle automatic number of column in responsive
            >
                {props.seletedStatus === null && allProjects && allProjects.map((project ,index)=>(
                    <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
                ))}
                {props.seletedStatus && projectsToDisplay && projectsToDisplay.map((project,index)=>(
                    <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
                ))}
            </div>
        </GrayDisplayBlock>
    )
}