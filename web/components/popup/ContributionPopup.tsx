'use client';
import React, { useState } from 'react'
import PopupLayout from './PopupLayout'
import { IoMdClose } from "react-icons/io";
import DividerOr from '../displayElements/DividerOr';
import InputFieldTransparent from '../displayElements/InputFieldTransparent';
import InputFieldTransparentNumber from '../displayElements/InputFieldTransparentNumber';
import MainButtonLabel from '../button/MainButtonLabel';
import MainButtonLabelAsync from '../button/MainButtonLabelAsync';
import SecondaryButtonLabel from '../button/SecondaryButtonLabel';
import { PublicKey } from '@solana/web3.js';
import { useSolstarterProgram } from '../solstarter/solstarter-data-access';
import { getSolFromLamports } from '@/utils/utilsFunctions';
import Divider from '../displayElements/Divider';


type Props = {
    project:Project
    projectAccountPublicKey:PublicKey
    contribution:Contribution | null
    userAccountPublicKey:PublicKey
    closePopup:()=>void
}

const ContributionPopup = (props: Props) => {
    const {addContribution,projectsAccounts} = useSolstarterProgram();

    const [contributionAmount, setContributionAmount] = useState<number>(0);
    const [isShowSuccess, setIsShowSuccess] = useState(false);

    const handleContributionAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContributionAmount(Number(e.target.value));
    };

    const handleContribute = async () => {
        try{
            await addContribution.mutateAsync({
                userAccountPublicKey: props.userAccountPublicKey,
                projectAccountPublicKey: props.projectAccountPublicKey,
                amount: contributionAmount
            });
            // refresh the project accounts
            projectsAccounts.refetch();
            // close the popup
            setIsShowSuccess(true);
        } catch (error){
            console.error('error',error);
        }
        
    }

    //* TEST
    // console.log("contributionAmount",contributionAmount);
    
    if (isShowSuccess){
        return (
            <PopupLayout padding="4" justify="start" item="start">
                <div className=
                    'bg-mainColor dark:bg-mainColorDark flex flex-col items-center justify-center gap-4 rounded-xl p-4'
                >
                    <button onClick={()=>props.closePopup()} className='w-full flex justify-end'><IoMdClose size={30}/></button>
                    <h3>Contribution effectuée</h3>
                    <p>Votre contribution de {contributionAmount} SOL a bien été enregistrée pour le projet {props.project.name}</p>
                    <button className='w-full md:w-1/2' onClick={props.closePopup}>
                        <MainButtonLabel label='Fermer'/>
                    </button>
                </div>
            </PopupLayout>
        )
    }

    return (
        <PopupLayout padding="8" justify="start" item="start">
            <div className=
                'bg-mainColor dark:bg-mainColorDark flex flex-col items-center justify-center gap-4 rounded-xl p-8'
            >
                <button onClick={()=>props.closePopup()} className='w-full flex justify-end'><IoMdClose size={30}/></button>
                <h3 className='text-xl'>Contribuer au projet {props.project.name}</h3>
                {props.contribution ? 
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <p className='text-textColor-second dark:text-textColor-second-dark'>Votre contribution actuelle à ce projet</p>
                        <p className='text-3xl font-bold'>{getSolFromLamports(props.contribution.amount)} SOL</p>
                    </div>
                :
                    <p className='text-textColor-second dark:text-textColor-second-dark'>Vous n&apos;avez pas encore contribué à ce projet</p>
                }
                {/* contribution level */}
                <Divider/>
                <p className='text-textColor-second dark:text-textColor-second-dark my-4'>Choisissez un niveau de contribution :</p>
                <div className='flex justify-between items-center w-full'>
                    {props.project.rewards.map((reward, index) => (
                        <button 
                            key={index} 
                            onClick={()=>setContributionAmount(reward.rewardAmount)}
                            className={`${index === 0 && "bg-green-600" } ${index === 1 && "bg-emerald-600" } ${index === 2 && "bg-teal-600" } rounded-full p-2`}>
                            <p className="text-center font-bold flex flex-col justify-center items-center gap-1 text-lg p-4 h-20 rounded-full aspect-square bg-gray-400 ">{reward.rewardAmount} SOL</p>
                        </button>
                    ))}
                </div>
                <DividerOr/>
                {/* free contribution  */}
                <p className='text-textColor-second dark:text-textColor-second-dark my-4'>Contribution libre</p>
                <InputFieldTransparentNumber placeholder='Saisir le montant' onchange={handleContributionAmountChange} value={contributionAmount}/>
                {/* button */}
                <div className='flex flex-col md:flex-row justify-center items-center gap-4 w-full mt-10'>
                    <button className='w-full md:w-1/2' onClick={props.closePopup}>
                        <SecondaryButtonLabel label='Annuler'/>
                    </button>
                    <button className='w-full md:w-1/2' onClick={handleContribute} disabled={contributionAmount === 0}>
                        <MainButtonLabelAsync isLoading={addContribution.isPending} label='Contribuer au projet' isDisabled={contributionAmount === 0}/>
                    </button>

                </div>
            </div>
        </PopupLayout>
    )
}

export default ContributionPopup
