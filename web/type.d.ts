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
    walletPubkey:PublicKey
    name:string
    avatarUrl:string
    bio:string
    createdProjectCounter:number
}

type Contribution= {
    userPubkey:PublicKey
    projectPubkey:PublicKey
    amount:number
}