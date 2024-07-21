'use client'
import Link from "next/link";
import MainButtonLabel from "../button/MainButtonLabel";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import { useState } from "react";
import { ProjectFilter, ProjectList } from "./projects-ui";

export function ProjectsFeature() {
    const [statusSelected, setStatusSelected] = useState<"ongoing" | "closed" | null>(null);


    return (
        <div className='w-full mx-auto flex flex-col items-center justify-start gap-4'>
            <h2 className='text-xl font-bold mb-6'>Les projets en cours</h2>
            <ProjectFilter setStatus={setStatusSelected} status={statusSelected}/>
            <ProjectList seletedStatus={statusSelected}/>    
        </div>
    );
}   