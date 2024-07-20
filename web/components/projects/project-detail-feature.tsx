'use client'
import { useEffect, useState } from "react";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import LoaderSmall from "../displayElements/LoaderSmall";
import { StandardErrorDisplay } from "../ui/ui-layout";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import MainButtonLabel from "../button/MainButtonLabel";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import ContributionPopup from "../popup/ContributionPopup";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";


type ProjectDetailFeatureProps = {
    projectAccountPubkey: string;
}

export function ProjectDetailFeature(props: ProjectDetailFeatureProps){
    const {publicKey} = useWallet();
    const {projectsAccounts,usersAccounts,contributionsAccounts,programId} = useSolstarterProgram();
    const router = useRouter();

    const [projectToDisplay, setProjectToDisplay] = useState<Project | null>(null);
    const [ownerToDisplay, setOwnerToDisplay] = useState<User | null>(null);
    const [userAccountPublicKey, setUserAccountPublicKey] = useState<PublicKey | null>(null);
    const [contributionToDisplay, setContributionToDisplay] = useState<Contribution | null>(null);
    const [isShowContributionPopup, setIsShowContributionPopup] = useState(false);

    // fetch the project info
    useEffect(() => { 
        // get the project data from the program accounts
        if (projectsAccounts.data){
            const projectData = projectsAccounts.data.find(
                (account) => account.publicKey.toBase58() === props.projectAccountPubkey
            );
            if(projectData) setProjectToDisplay(projectData.account as Project);
        }
     },[props.projectAccountPubkey,projectsAccounts.data]);

    //fetch the owner info
    useEffect(() => {
        if(usersAccounts.data && projectToDisplay){
            const ownerData = usersAccounts.data.find(
                (account) => account.publicKey.toString() === projectToDisplay?.userPubkey.toString()
            );
            if(ownerData){
                setOwnerToDisplay(ownerData.account as User);          }
        }
    },[projectToDisplay,usersAccounts.data]);

    // fetch the contribution info if exist
    useEffect(() => {
        const fetchContributionPDA = async () => {
            if (props.projectAccountPubkey && userAccountPublicKey && contributionsAccounts.data) {
                try {
                    const projectPubkey = new PublicKey(props.projectAccountPubkey);
                    const [contributionPDA] = await PublicKey.findProgramAddressSync(
                        [
                            Buffer.from("contribution"),
                            projectPubkey.toBuffer(),
                            userAccountPublicKey.toBuffer(),
                        ],
                        programId
                    );
                    console.log("contributionPDA",contributionPDA.toString());
                    
                    // Fetch the contribution account if it exists
                    const contributionAccount = contributionsAccounts.data.find(
                        (account) => account.publicKey.equals(contributionPDA)
                    );

                    if (contributionAccount) {
                        setContributionToDisplay(contributionAccount.account as Contribution);
                    }
                } catch (error) {
                    console.error("Error fetching contribution PDA:", error);
                }
            }
        };

        fetchContributionPDA();
    }, [props.projectAccountPubkey, publicKey, contributionsAccounts.data]);

    // fetch the user account public key
    useEffect(()=>{
        if (usersAccounts.data && publicKey){
            const userAccountData = usersAccounts.data.find(
                (account) => account.account.walletPubkey.equals(publicKey)
            );
            if(userAccountData) setUserAccountPublicKey(userAccountData.publicKey);
        }
    },[usersAccounts.data?.values,publicKey]);

    if (projectsAccounts.isPending) return <LoaderSmall/>;

    if(!projectToDisplay) return <StandardErrorDisplay/>;

    //* TEST
    // console.log("projectToDisplay",projectToDisplay);
    // console.log("ownerToDisplay",ownerToDisplay);
    console.log("contributionAccounts",contributionsAccounts.data && contributionsAccounts.data[0].publicKey.toString());
    console.log("contributionToDisplay",contributionToDisplay);
    // console.log("projectPubkey",props.projectAccountPubkey.toString());
    // console.log("userAccountPublicKey",userAccountPublicKey?.toString())
    
    

    return (
        <div className='w-full mx-auto flex flex-col items-start justify-start gap-4'>
            <div className="flex justify-start w-full">
                <button onClick={()=>router.back()} className="flex justify-start items-center text-textColor-second dark:text-textColor-second-dark">
                    <IoArrowBack/><p>retour</p>
                </button>
            </div>
            {/* title */}
            <h2 className='text-xl font-bold mx-auto'>{projectToDisplay?.name}</h2>
            {/* image and contribution */}
            <div className="flex justify-start items-start gap-8 w-full">
                <div className="relative w-1/3 aspect-square">
                    <Image src={projectToDisplay.imageUrl} alt='project image' fill  className=' object-cover ' />
                </div>
                <div className="flex flex-col items-start justify-between w-full gap-4">
                    <p>Montant des contributions</p>
                    <p>{projectToDisplay.raisedAmount.toString()} SOL sur {projectToDisplay.goalAmount.toString()} SOL </p>
                    {/* interaction */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
                        <button className="w-1/3" onClick={()=>setIsShowContributionPopup(true)}><MainButtonLabel label="Contribuer au projet"/></button>
                        <button className="w-1/3">
                            <div className={`flex justify-center items-center rounded-full bg-accentColor  hover:bg-accentColor/50  text-h3 text-white  text-center px-2 py-4 transition-all`}>
                             Partager sur X
                            </div>

                        </button>
                    </div>
                </div>
            </div>
            {/* about */}
            <h3 className="font-bold mt-10">A propos du projet</h3>
            <p className="text-textColor-second dark:text-textColor-second-dark">{projectToDisplay.projectDescription}</p>
            {/* reward levels */}
            <h3 className="font-bold mt-10">Les niveaux de récompense</h3>
            <div className="flex justify-around items-center w-full">
                {projectToDisplay.rewards.map((reward : Reward, index :number) => (
                    <div key={index} className="flex flex-col items-center justify-start gap-2">
                        <p>Niveau {index+1} </p>
                        <p className="flex flex-col justify-center items-center gap-1 text-3xl p-4 h-32 rounded-full aspect-square bg-gray-200 halo-effect">
                            {reward.rewardAmount} <span className="text-xl">sol</span>
                        </p>
                        <p className="text-textColor-second dark:text-textColor-second-dark">{reward.rewardDescription}</p>
                    </div>
                ))}
            </div>
            {/* owner info */}
            <h3 className="font-bold mt-10">A propos du porteur de projet</h3>
            {ownerToDisplay &&
                <div className="flex justify-start items-start">
                    <p className="text-textColor-second dark:text-textColor-second-dark w-full md:w-1/2">{ownerToDisplay?.bio}</p>
                    <div className='flex flex-col items-center justify-start gap-2 '>
                        {ownerToDisplay.avatarUrl && <Image src={ownerToDisplay.avatarUrl} alt={ownerToDisplay.name} width={150} height={150} className='rounded-full'/>}
                        <p className='text-center'>{ownerToDisplay.name}</p>
                    </div>
                </div>
            }
            {isShowContributionPopup && userAccountPublicKey &&
                <ContributionPopup 
                    project={projectToDisplay} 
                    projectAccountPublicKey={new PublicKey(props.projectAccountPubkey)}
                    contribution={contributionToDisplay}
                    userAccountPublicKey={userAccountPublicKey}
                    closePopup={()=>setIsShowContributionPopup(false)}
                />
            }
        </div>
    )
}