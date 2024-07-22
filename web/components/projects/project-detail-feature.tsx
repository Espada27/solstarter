'use client'
import { useEffect, useMemo, useState } from "react";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import LoaderSmall from "../displayElements/LoaderSmall";
import { StandardErrorDisplay } from "../ui/ui-layout";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import MainButtonLabel from "../button/MainButtonLabel";
import ContributionPopup from "../popup/ContributionPopup";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getProgressPercentage, getSolFromLamports, getStatusString } from "@/utils/utilsFunctions";
import { ProjectStatus } from "@/data/enum";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import { Audiowide} from "next/font/google";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import {BN} from "@coral-xyz/anchor"

const audioWide = Audiowide({weight: '400',subsets: ['latin']});


type ProjectDetailFeatureProps = {
    projectAccountPubkey: string;
}

export function ProjectDetailFeature(props: ProjectDetailFeatureProps){
    const {publicKey} = useWallet();
    const {withdraw, projectsAccounts,usersAccounts,contributionsAccounts,programId} = useSolstarterProgram();
    const router = useRouter();

    const [projectToDisplay, setProjectToDisplay] = useState<Project | null>(null);
    const [percentage,setPercentage] = useState<number>(0); 
    const [ownerToDisplay, setOwnerToDisplay] = useState<User | null>(null);
    const [userAccountPublicKey, setUserAccountPublicKey] = useState<PublicKey | null>(null);
    const [isProjectOwner, setIsProjectOwner] = useState<boolean | null>(null);
    const [contributionToDisplay, setContributionToDisplay] = useState<Contribution | null>(null);
    const [isShowContributionPopup, setIsShowContributionPopup] = useState(false);

    // fetch the project info
    useEffect(() => { 
        // get the project data from the program accounts
        if (projectsAccounts.data){
            const projectData = projectsAccounts.data.find(
                (account) => account.publicKey.toBase58() === props.projectAccountPubkey
            );
            if(projectData) {
                setProjectToDisplay(projectData.account as Project);
                setPercentage(getProgressPercentage(projectData.account.raisedAmount, projectData.account.goalAmount));
            }
        }
     },[props.projectAccountPubkey, projectsAccounts.data]);

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

    // check if the user is the owner of the project
    useEffect(() => {
        if (PublicKey && projectToDisplay){
            const isOwner: boolean = publicKey?.equals(projectToDisplay?.ownerPubkey as PublicKey) ? true : false;
            setIsProjectOwner(isOwner);
        }
    },[publicKey, projectToDisplay]);

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

    const isCompleted = useMemo(()=>{
        if (projectToDisplay) {
            return (projectToDisplay.raisedAmount as unknown as BN).gte(projectToDisplay.goalAmount as unknown as BN);
        }
    },[projectToDisplay]);

    const handleWithdraw = async () => {
        try{
            await withdraw.mutateAsync({
                projectAccountPublicKey: new PublicKey(props.projectAccountPubkey),
            });
        } catch (error){
            console.error('error',error);
        }
        
    }

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            console.log('Lien copié dans le presse-papiers!');
        }).catch((error) => {
            console.error('Erreur lors de la copie du lien:', error);
        });
    }

    if (projectsAccounts.isPending) return <LoaderSmall/>;

    if(!projectToDisplay) return <StandardErrorDisplay/>;

    return (
        <div className='w-full mx-auto flex flex-col items-start justify-start gap-4'>
            <div className="flex justify-start w-full">
                <button onClick={()=>router.back()} className="flex justify-start items-center text-textColor-second dark:text-textColor-second-dark">
                    <IoArrowBack/><p>retour</p>
                </button>
            </div>
    
            {/* title */}
            <h2 className={`${audioWide.className} text-3xl font-bold mx-auto mb-10`}>{projectToDisplay?.name}</h2>
            {/* main info */}
            <GrayDisplayBlock padding='8'>
                <div className="flex justify-start items-start gap-8 w-full">
                    {/* first row */}
                    <div className="flex flex-col items-start justify-between w-1/3 gap-2">
                        <div className="relative w-full aspect-square">
                            <Image src={projectToDisplay.imageUrl} alt='project image' fill  className=' object-cover rounded-xl ' />
                        </div>
                        <div className="flex justify-between items-center w-full">
                            <p className="text-xl">Montant des contributions</p>
                            <p className="font-bold">{percentage} %</p>
                        </div>
                        {/* barre de progression */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 z-0">
                            <div className="bg-green-600 h-1.5" style={{width: `${percentage}%`}}></div>
                        </div>
                        {/* amount */}
                        <p className="text-2xl font-thin text-textColor-second dark:text-textColor-second-dark">
                            {getSolFromLamports(projectToDisplay.raisedAmount).toString() } SOL sur {getSolFromLamports(projectToDisplay.goalAmount).toString()} SOL
                        </p>
                    </div>
                    {/* second row */}
                    <div className="flex flex-col items-start justify-start w-2/3 min-h-full">
                        <h3 className="text-xl font-bold">A propos du projet</h3>
                        <p className="text-textColor-second dark:text-textColor-second-dark">{projectToDisplay.projectDescription}</p>
                        <div className="flex justify-center items-center gap-4 mt-10 w-full">
                            {getStatusString(projectToDisplay.status) != ProjectStatus.Completed.toString() ?
                                <button className="w-1/3" onClick={()=>setIsShowContributionPopup(true)}>
                                    <MainButtonLabel label="Contribuer au projet"/>
                                </button>
                                :
                                <div className="w-1/3">
                                    <MainButtonLabel label="Projet terminé" isDisabled={true}/>
                                </div>
                            }
                            <a
                                href="https://dial.to/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-1/3"
                                onClick={handleCopyLink}
                            >
                                <MainButtonLabel label="Partager sur X"/>
                            </a>
                        </div>
                    </div>
                </div>

            </GrayDisplayBlock>
            {/* reward levels */}
            <GrayDisplayBlock padding='8'>
                <div className="flex justify-start items-start gap-10 w-full">
                    <h3 className="text-xl font-bold ">Les niveaux de récompense</h3>
                    <div className="flex justify-around items-start w-full gap-10">
                        {projectToDisplay.rewards.map((reward : Reward, index :number) => (
                            <div key={index} className="flex flex-col items-center justify-start gap-2">
                                <p>Niveau {index+1} </p>
                                <div className={`${index === 0 && "bg-green-600" } ${index === 1 && "bg-emerald-600" } ${index === 2 && "bg-teal-600" } rounded-full p-2`}>
                                    <p className="text-center font-bold flex flex-col justify-center items-center gap-1 text-3xl p-4 h-32 rounded-full aspect-square bg-gray-400 " >
                                        {reward.rewardAmount} <span className="text-xl font-normal">sol</span>
                                    </p>
                                </div>
                                <p className="text-textColor-second dark:text-textColor-second-dark text-center">{reward.rewardDescription}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </GrayDisplayBlock>
            {/* owner info */}
            <GrayDisplayBlock padding='8'>
                <div className="flex justify-start items-start gap-10 w-full">
                    <h3 className="font-bold text-xl">A propos du porteur de projet</h3>
                    {ownerToDisplay &&
                        <div className="flex justify-start items-center gap-10">
                            <p className="text-textColor-second dark:text-textColor-second-dark w-full md:w-1/2">{ownerToDisplay?.bio}</p>
                            <div className='flex flex-col items-center justify-start gap-2 '>
                                {ownerToDisplay.avatarUrl && <Image src={ownerToDisplay.avatarUrl} alt={ownerToDisplay.name} width={150} height={150} className='rounded-full'/>}
                                <p className='text-center'>{ownerToDisplay.name}</p>
                            </div>
                            {isProjectOwner && 
                                <button onClick={handleWithdraw} className="w-1/3" disabled={!isCompleted}>
                                    <MainButtonLabel label={isCompleted? "Cible atteinte : Retirer les fonds" : "Retrait impossible : cible pas encore atteinte"} isDisabled={!isCompleted}/>
                                </button>
                            }
                        </div>
                    }
                </div>
            </GrayDisplayBlock>
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