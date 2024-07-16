'use client'
import ProjectCard from '@/components/cards/ProjectCard'
import InputFieldTransparent from '@/components/displayElements/InputFieldTransparent'
import { projects } from '@/data/localdata'
import React, { useState } from 'react'

// type Props = {}

const ProjectPage = (/*props: Props*/) => {
  const [status, setStatus] = useState<"ongoing" | "closed" | null>(null)


  return (
    <div className='flex flex-col justify-start items-center min-h-screen m-10 '>
      {/* page title */}
      <h2 className='text-2xl'>Les projets en cours</h2>
      {/* filter */}
      <div className='flex justify-start items-center w-full py-10'>
        <div className='flex justify-start gap-4 w-1/3'>
          <input type="radio" id='ongoing' checked={status === "ongoing"} onChange={()=>setStatus("ongoing")} className='p-2'/>
          <label className='w-full'>
            Contribution en cours
          </label>
          <input type="radio" id='closed' checked={status === "closed"} onChange={()=>setStatus("closed")}/>
          <label className='w-full'>
            Contribution terminée
          </label>
        </div>
        <div className='w-1/4'>
          <InputFieldTransparent value='' placeholder='Rechercher un projet' onchange={()=>{console.log('change')}}/>
        </div>
      </div>
      {/* projects */}
      <div 
        className="hidden lg:grid gap-20  w-full justify-center"
        style={{gridTemplateColumns:"repeat(auto-fit,minmax(420px,auto))"}} // handle automatic number of column in responsive
      >
      {projects && projects.map((project,index)=>(
        <ProjectCard key={index} project={project}/>
      ))}
      </div>
    </div>
  )
}

export default ProjectPage