import { ProjectDetailFeature } from '@/components/projects/project-detail-feature'
import React from 'react'

type Props = {
    params:
    {
        projectAccountPubkey:string
    }
}

const page = (props: Props) => {
  return <ProjectDetailFeature projectAccountPubkey={props.params.projectAccountPubkey}/>
}

export default page