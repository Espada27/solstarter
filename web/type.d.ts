type AccountWrapper<T> = {
    publicKey: PublicKey;
    account: T;
};

type Reward ={
    name:string
    rewardDescription:string
    rewardAmount:number
}

type Project ={
    pubkey:string // should be pda address
    ownerPubkey:PublicKey
    userPubkey:PublicKey
    name:string
    imageUrl:string
    projectDescription:string
    goalAmount:number
    raisedAmount:number
    endTime:Date
    status:ProjectStatus
    contributionCounter:number
    rewards:Reward[]
    createdTime:Date
}

type User ={
    walletPubkey:string
    name:string
    avatarUrl:string
    bio:string
    createdProjectCounter:number
}