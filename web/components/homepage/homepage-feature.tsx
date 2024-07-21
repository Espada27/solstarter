'use client';

import { projects } from '@/data/localdata';
import { AppHero } from '../ui/ui-layout';
import HighlightProjects from './highlight-projects';
import MainButtonLabel from '../button/MainButtonLabel';
import Link from 'next/link';
import { useSolstarterProgram } from '../solstarter/solstarter-data-access';
import { useEffect, useState } from 'react';
import { getSolFromLamports } from '@/utils/utilsFunctions';


export default function HomepageFeature() {
  const {contributionsAccounts} = useSolstarterProgram();

  const [nbOfContributions,setNbOfContributions] = useState<number>(0);
  const [totalAmount,setTotalAmount] = useState<number>(0);

  //calculate the number and total amount of contributions
  useEffect(() => {
    if (contributionsAccounts.data){
      setNbOfContributions(contributionsAccounts.data.length);
      setTotalAmount(contributionsAccounts.data.reduce((acc,contribution) => acc+contribution.account.amount,0));
    }
  }, [contributionsAccounts.data]);

  return (
    <div className=' w-full mb-10'>
      <AppHero title="Bienvenue sur Solstarter" subtitle="La plateforme de financement nouvelle génération" />
      <h3 className='flex justify-center text-3xl font-semibold pb-10 text-center gap-1'>
        Déjà 
        <span className='text-accentColor font-bold'>{nbOfContributions}</span>
        contributions pour un total de 
        <span className='text-accentColor font-bold'>{getSolFromLamports(totalAmount) } </span>
        SOL</h3>
      <h3 className='text-2xl p-2 text-center'>Les plus gros succès</h3>
      <HighlightProjects projects={projects} />
      <div className='w-full md:w-1/4 mx-auto py-10'>
        <Link href={"/createproject"}><MainButtonLabel label='Proposer un projet'/></Link>
      </div>
      <h3 className='text-lg text-center'>Contribuez, évaluez, réallouez</h3>
      <p className='text-textColor-second dark:text-textColor-second-dark text-center w-full md:w-1/2 mx-auto'>
        Sur Solstarter, votre contribution initiale vit au gré de votre évaluation du projet,
        Maintenez la pour conserver votre avantage à venir ou bien revendez là pour basculer sur un autre projet ; ou pour shill au restaurant 😎<br/>
        Et tout ça, grâce au web3 et à la blockchain
      </p>
    </div>
  );
}
