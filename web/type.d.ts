type Reward ={
    id:string
    name:string
    description:string
    required_amount:number
}

type Project ={
    id:string
    name:string
    pictureURL:string
    short_description:string
    amount_goal:number
    amount_raised:number
    end_time:number
    status:ProjectStatus
    contribution_counter:number
    rewards:Reward[]
}