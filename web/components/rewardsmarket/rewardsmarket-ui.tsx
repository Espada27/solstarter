'use client'
import { useEffect, useState } from "react";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import InputFieldTransparent from "../displayElements/InputFieldTransparent";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import { extractAccountsData } from "@/utils/utilsFunctions";
import ProjectCard from "../cards/ProjectCard";
import ContributionCard from "../cards/ContributionCard";

//* FILTERS
type RewardsFilterProps = {
    level: "1" | "2" |"3" | null;
    setLevel: (level: "1" | "2" |"3" | null) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export function RewardsFilter(props:RewardsFilterProps){
    return (
        <GrayDisplayBlock padding="4">
            <div className='flex justify-between items-center w-full px-4'>
                <div className='flex justify-start gap-2 w-1/2 '>
                <label className='w-full'>
                    <input type="radio" id='ongoing' checked={props.level === "1"} onChange={()=>props.setLevel("1")} className='mr-1'/>
                    Niveau 1
                </label>
                <label className='w-full'>
                    <input type="radio" id='closed' checked={props.level === "2"} onChange={()=>props.setLevel("2")} className='mr-1'/>
                    Niveau 2
                </label>
                <label className='w-full'>
                    <input type="radio" id='closed' checked={props.level === "3"} onChange={()=>props.setLevel("3")} className='mr-1'/>
                    Niveau 3
                </label>
                <label className='w-full'>
                    <input type="radio" id='all' checked={props.level === null} onChange={()=>props.setLevel(null)} className='mr-1'/>
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
type RewardsListProps = {
    level: "1" | "2" |"3" | null;
    searchTerm: string;
}
export function RewardsList(props:RewardsListProps){
    const {contributionsAccounts} = useSolstarterProgram();

    const [allContributions, setAllContributions] = useState<AccountWrapper<Contribution>[]>([]); // use the AccountWrapper type to handle the publicKey
    const [contributionsToDisplay, setContributionsToDisplay] = useState<AccountWrapper<Contribution>[]>([]); // use the AccountWrapper type to handle the publicKey

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
        if (contributionsAccounts.data){
            setAllContributions(contributionsAccounts.data as AccountWrapper<Contribution>[]);
        }
    }, [contributionsAccounts.data]);

    //! FILTER IMPOSSIBLE WITH THE ACTUAL CONTRIBUTION DATA MODEL
    // update project function of selected status
    // useEffect(() => {
    //     let filteredProjects = allContributions;

    //     if (props.level) {
    //         filteredProjects = filteredProjects.filter(project => getStatusString(project.account.) === props.seletedStatus);
    //     }

    //     if (props.searchTerm) {
    //         filteredProjects = filteredProjects.filter(project => project.account.name.toLowerCase().includes(props.searchTerm.toLowerCase()));
    //     }

    //     setContributionsToDisplay(filteredProjects);
    // }, [props.seletedStatus, props.searchTerm, allContributions]);

    //* TEST
    // console.log("projectsAccounts",projectsAccounts.data);
    
    return (
        <GrayDisplayBlock padding='4'>
            <div 
                className="grid gap-20  w-full justify-center"
                style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,auto)"}} // handle automatic number of column in responsive
            >
                {contributionsToDisplay && allContributions.map((contribution,index)=>(
                    <ContributionCard key={index} contributions={contribution.account}/>
                ))}
            </div>
        </GrayDisplayBlock>
    )
}