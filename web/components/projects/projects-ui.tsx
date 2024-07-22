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
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function ProjectFilter(props:ProjectFilterProps){
    return (
        <GrayDisplayBlock padding="4">
            <div className='flex justify-between items-center w-full px-4'>
                <div className='flex justify-start gap-2 w-1/2 '>
                <label className='w-full'>
                    <input type="radio" id='ongoing' checked={props.status === "ongoing"} onChange={()=>props.setStatus("ongoing")} className='mr-1'/>
                    En cours
                </label>
                <label className='w-full'>
                    <input type="radio" id='closed' checked={props.status === "closed"} onChange={()=>props.setStatus("closed")} className='mr-1'/>
                    Terminée
                </label>
                <label className='w-full'>
                    <input type="radio" id='all' checked={props.status === null} onChange={()=>props.setStatus(null)} className='mr-1'/>
                    Tous
                </label>
                </div>
                <div className='flex justify-end w-full'>
                    <InputFieldTransparent value={props.searchTerm} placeholder="Rechercher un projet" onchange={(e)=>props.setSearchTerm(e.target.value)}/>
                </div>
            </div>
        </GrayDisplayBlock>
    )
}


//* PROJECTS LIST
type ProjectListProps = {
    seletedStatus: "ongoing" | "closed" | null;
    searchTerm: string;
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
        let filteredProjects = allProjects;

        if (props.seletedStatus) {
            filteredProjects = filteredProjects.filter(project => getStatusString(project.account.status) === props.seletedStatus);
        }

        if (props.searchTerm) {
            filteredProjects = filteredProjects.filter(project => project.account.name.toLowerCase().includes(props.searchTerm.toLowerCase()));
        }

        setProjectsToDisplay(filteredProjects);
    }, [props.seletedStatus, props.searchTerm, allProjects]);

    //* TEST
    // console.log("projectsAccounts",projectsAccounts.data);
    
    return (
        <GrayDisplayBlock padding='4'>
            <div 
                className="grid gap-20  w-full justify-center"
                style={{gridTemplateColumns:"repeat(auto-fit,minmax(420px,auto)"}} // handle automatic number of column in responsive
            >
                {/* if not filter */}
                {props.seletedStatus === null && props.searchTerm==="" && allProjects && allProjects.map((project ,index)=>(
                    <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
                ))}
                {/* if filter */}
                {(props.seletedStatus || props.searchTerm)&& projectsToDisplay && projectsToDisplay.map((project,index)=>(
                    <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
                ))}
            </div>
        </GrayDisplayBlock>
    )
}