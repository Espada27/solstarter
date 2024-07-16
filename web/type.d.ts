type Reward ={
    id:string
    name:string
    description:string
    required_amount:number
}

type Project ={
    pubkey:string // should be pda address
    owner_pubkey:string
    name:string
    image_url:string
    project_description:string
    goal_amount:number
    raised_amount:number
    end_time:number
    status:ProjectStatus
    contribution_counter:number
    rewards:Reward[]
}

type User ={
    wallet_pubkey:string
    name:string
    avatar_url:string
    bio:string
    created_project_counter:number
}