export enum ProjectStatus {
    Draft,
    Ongoing,
    Completed,
    Abandoned,
}
  
export type Reward = {
    name:string
    description:string
    required_amount:number
}
  
// Project type used by datasets and tests files
// Some attributes are optional because they are set by the program at creation
export type Project = {
    owner_pubkey?: string
    user_pubkey?: string
    name:string
    image_url:string
    project_description:string
    goal_amount:number
    raised_amount?:number
    created_time:number
    end_time:number
    status?:ProjectStatus
    contribution_counter?:number
    rewards:Reward[]
  }
  
export type User = {
    wallet_pubkey?: string
    name: string
    avatar_url: string
    bio: string
    created_project_counter: number
  }

  export type Contribution = {
    amount: number
    user_pubkey: string
    project_pubkey: string
  }
  