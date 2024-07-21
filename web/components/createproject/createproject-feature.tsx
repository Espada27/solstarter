'use client'
import Link from "next/link";
import MainButtonLabel from "../button/MainButtonLabel";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import Divider from "../displayElements/Divider";
import MainButtonLabelAsync from "../button/MainButtonLabelAsync";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import toast from "react-hot-toast";
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { NoAccountCreated, NoWalletConnected } from "../myprofile/myprofile-ui";





export function CreateProjectFeature(){
    const {publicKey} = useWallet();
    const {usersAccounts} = useSolstarterProgram();

    const [userAccountPubkey, setUserAccountPubkey] = useState<PublicKey | null>(null);
    const [userAccount, setUserAccount] = useState<User | null>(null);

    // check if usersAccounts includes the user account
    useEffect(()=>{
        if (usersAccounts.data && publicKey){
            const userAccount = usersAccounts.data.find(
                (account) => account.account.walletPubkey.equals(publicKey)
            );

            if (userAccount) {
                setUserAccountPubkey(userAccount.publicKey);
                setUserAccount(userAccount.account as unknown as User);
            }
        }
    },[usersAccounts.data?.values,publicKey])

    
    if (!publicKey) {
        return <NoWalletConnected />;
    }

    if (!userAccount) {
        return <CreateAccountFirst />;
    }

    if (userAccount && userAccountPubkey){
        return <CreateProjectForm userAccount={userAccount} userAccountPubkey={userAccountPubkey}/>;
    }

    // default return (should never be displayed)
    return (
        <div className='w-full md:w-1/2 mx-auto mt-24'>
          <GrayDisplayBlock padding='8'>
            <div className="flex flex-col items-center justify-center gap-10 w-full">
                <p>Il y a eu un souci...</p>
                <Link href={'/'}><MainButtonLabel label="Retourner à l'accueil"/></Link>
            </div>
          </GrayDisplayBlock>
        </div>
    )
}

//* Create account first
export function CreateAccountFirst(){
    return (
        <div className='w-full md:w-1/2 mx-auto mt-24'>
          <GrayDisplayBlock padding='8'>
            <div className="flex flex-col items-center justify-center gap-10 w-full">
                <p className="text-center text-textColor-second dark:text-textColor-second-dark">Vous devez d&apos;abord créer un compte Solstarter avant de proposer un projet</p>
                <Link href={'/myprofile'}><MainButtonLabel label="Créer mon compte solstarter"/></Link>
            </div>
          </GrayDisplayBlock>
        </div>
    )
}

//* CreateProjectForm
type CreateProjectFormProps = {
    userAccount:User
    userAccountPubkey:PublicKey
}

export function CreateProjectForm(props:CreateProjectFormProps){
    //* GLOBAL STATE
    const {publicKey} = useWallet();
    const {createProject} = useSolstarterProgram();
    
    //* LOCAL STATE
    const [rewards, setRewards] = useState<Reward[]>([
        {
            name: '',
            rewardDescription: '',
            rewardAmount: new BN(1)            
        },
        {
            name: '',
            rewardDescription: '',
            rewardAmount: new BN(1)             
        },
        {
            name: '',
            rewardDescription: '',
            rewardAmount: new BN(1)             
        },
    ])

    const [projectToCreate, setProjectToCreate] = useState<Partial<Project>>({
        name: '',
        imageUrl: '',
        projectDescription: '',
        goalAmount: 0,
        endTime: new Date(),
        rewards: rewards,
    })

   
    //* LOCAL FUNCTIONS
    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProjectToCreate((prevProfile) => ({
          ...prevProfile,
          [name]: value
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if(!date) return;
        setProjectToCreate(prevProject => ({
            ...prevProject,
            endTime: date
        }));
    };

    const handleRewardChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newRewards = [...rewards];
        newRewards[index] = {
            ...newRewards[index],
            [name]: name === 'reward_amount' ? new BN(value) : value // Convert to BN if reward_amount
        };
        setRewards(newRewards);
        setProjectToCreate(prevProject => ({ ...prevProject, rewards: newRewards }));
    };

    const isAllDataSetted = useMemo(() => {
        return projectToCreate.name && projectToCreate.imageUrl && projectToCreate.projectDescription && projectToCreate.goalAmount && projectToCreate.endTime
    }, [projectToCreate]);


    //* PROGRAM CALLS
    // on submit, launch de createUser method
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();       
        if(!publicKey) {
            toast.error('Wallet non connecté')
            return; 
        }
        if(!props.userAccountPubkey || !props.userAccount) {
            toast.error('Compte utilisateur introuvable')
            return;
        }
        if (publicKey && props.userAccountPubkey && projectToCreate.name && projectToCreate.imageUrl && projectToCreate.projectDescription && projectToCreate.goalAmount && projectToCreate.endTime) {
            createProject.mutateAsync({
            userAccountPublicKey: props.userAccountPubkey,
            name: projectToCreate.name,
            image_url: projectToCreate.imageUrl,
            project_description: projectToCreate.projectDescription,
            goal_amount: projectToCreate.goalAmount,
            end_time: projectToCreate.endTime.getTime()  ,
            rewards: rewards,
            userProjectCounter: props.userAccount.createdProjectCounter
            });
        } else {
            toast.error('Informations manquantes')
        }
    };

    //* TEST
    // console.log("projectToCreate", projectToCreate);
    // console.log("userAccount", userAccount);
    console.log("userAccountPubkey", props.userAccountPubkey?.toString());
    

    return (
        <div className='w-full md:w-1/2 mx-auto mt-10 flex flex-col items-center justify-start gap-10'>
            <h2 className='text-2xl font-bold '>Proposer un projet</h2>
            <GrayDisplayBlock padding='8'>
                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <p className="text-textColor-main dark:text-textColor-main-dark">Bienvenue dans l&apos;espace de création de projet. Toutes les informations doivent être remplies avant de pouvoir valider la création du projet</p>
                </div>
            </GrayDisplayBlock>
            <GrayDisplayBlock padding='8'>
                {/* main info */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
                    <p className="font-bold">Informations générales</p>
                    <div className="flex flex-col w-full">
                        <label htmlFor="name">Nom du projet</label>
                        <input
                            type="text"
                            placeholder='Un nom court et représentatif'
                            name="name"
                            id="name"
                            value={projectToCreate.name}
                            onChange={handleProjectChange}
                            className="border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="image_url">Illustration du projet</label>
                        <input
                            type="text"
                            placeholder='Insérer une URL valide jpeg,png ou webp'
                            name="imageUrl"
                            id="imageUrl"
                            value={projectToCreate.imageUrl}
                            onChange={handleProjectChange}
                            className="border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                        />
                    </div>
                    <div className="flex flex-col w-full ">
                        <label htmlFor="name">Description du projet</label>
                        <textarea
                            rows={4}      
                            placeholder='Expliquez votre projet en quelques lignes et à quoi serviront les fonds récoltés'        
                            name="projectDescription"
                            id="projectDescription"
                            value={projectToCreate.projectDescription}
                            onChange={handleProjectChange}
                            className="border border-gray-400 rounded-xl p-2 text-textColor-second dark:text-textColor-second-dark"
                        />
                    </div>
                    <div className="flex flex-col w-full ">
                        <label htmlFor="name">Cible de contribution</label>
                        <div className="flex justify-start items-center gap-2 w-full">
                            <input
                                type="number"
                                placeholder='Montant souhaité en SOL'
                                name="goalAmount"
                                id="goalAmount"
                                value={projectToCreate.goalAmount}
                                onChange={handleProjectChange}
                                className="w-full border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                            />
                            <p >SOL</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full ">
                        <label htmlFor="name">Date de cloture des contributions</label>
                        <DatePicker selected={projectToCreate.endTime} onChange={(date)=>handleDateChange(date)} className="w-full border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"/>
                    </div>
                    {/* rewards */}
                    <Divider/>
                    <p className="font-bold mt-10">Niveaux de récompense</p>
                    {/* reward level 1 */}
                    <p className="flex w-full -mb-4">Niveau 1</p>
                    <Divider/>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full mb-10">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <p>Montant cible</p>
                            <input
                                type="number"
                                placeholder='Montant souhaité en SOL'
                                name="rewardAmount"
                                id="rewardAmount"
                                min={1}
                                value={rewards[0].rewardAmount}
                                onChange={(e) => handleRewardChange(0, e)}
                                className="w-full border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full">
                            <p>Avantage associé</p>
                            <textarea
                                rows={2}      
                                placeholder='Définissez l&apos;avantage associé à ce niveau de récompense'        
                                name="rewardDescription"
                                id="rewardDescription"
                                value={rewards[0].rewardDescription}
                                onChange={(e) => handleRewardChange(0, e)}
                                className="border border-gray-400 rounded-xl p-2 text-textColor-second dark:text-textColor-second-dark w-full"
                            />
                        </div>
                    </div>
                    {/* reward level 2 */}
                    <p className="flex w-full -mb-4">Niveau 2</p>
                    <Divider/>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full mb-10">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <p>Montant cible</p>
                            <input
                                type="number"
                                placeholder='Montant souhaité en SOL'
                                name="rewardAmount"
                                id="rewardAmount"
                                min={1}
                                value={rewards[1].rewardAmount}
                                onChange={(e) => handleRewardChange(1, e)}
                                className="w-full border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full">
                            <p>Avantage associé</p>
                            <textarea
                                rows={2}      
                                placeholder='Définissez l&apos;avantage associé à ce niveau de récompense'        
                                name="rewardDescription"
                                id="rewardDescription"
                                value={rewards[1].rewardDescription}
                                onChange={(e) => handleRewardChange(1, e)}
                                className="border border-gray-400 rounded-xl p-2 text-textColor-second dark:text-textColor-second-dark w-full"
                            />
                        </div>
                    </div>
                    {/* reward level 3 */}
                    <p className="flex w-full -mb-4">Niveau 3</p>
                    <Divider/>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full mb-10">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <p>Montant cible</p>
                            <input
                                type="number"
                                placeholder='Montant souhaité en SOL'
                                name="rewardAmount"
                                id="rewardAmount"
                                min={1}
                                value={rewards[2].rewardAmount}
                                onChange={(e) => handleRewardChange(2, e)}
                                className="w-full border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
                            />
                        </div>
                        <div className="flex flex-col items-start justify-start gap-2 w-full">
                            <p>Avantage associé</p>
                            <textarea
                                rows={2}      
                                placeholder='Définissez l&apos;avantage associé à ce niveau de récompense'        
                                name="rewardDescription"
                                id="rewardDescription"
                                value={rewards[2].rewardDescription}
                                onChange={(e) => handleRewardChange(2, e)}
                                className="border border-gray-400 rounded-xl p-2 text-textColor-second dark:text-textColor-second-dark w-full"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full md:w-1/2" disabled={!isAllDataSetted}>
                        <MainButtonLabelAsync label="Créer le projet" isLoading={createProject.isPending} isDisabled={!isAllDataSetted}/>
                    </button>
                
                </form>
            </GrayDisplayBlock>
        </div>

    )

}