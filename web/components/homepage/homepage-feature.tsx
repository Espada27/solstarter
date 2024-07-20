'use client';

import { projects } from '@/data/localdata';
import { AppHero } from '../ui/ui-layout';
import HighlightProjects from './highlight-projects';
import MainButtonLabel from '../button/MainButtonLabel';
import Link from 'next/link';


export default function HomepageFeature() {
  return (
    <div className=' w-full mb-10'>
      <AppHero title="Bienvenue sur Solstarter" subtitle="La plateforme de financement nouvelle génération" />
      <h3 className='text-2xl p-2 text-center'>Les plus gros succès</h3>
      <HighlightProjects projects={projects} />
      <div className='w-full md:w-1/4 mx-auto py-10'>
        <Link href={"/createproject"}><MainButtonLabel label='Proposer un projet'/></Link>
      </div>
      <h3 className='text-lg text-center'>Contribuez, évaluez, réallouez</h3>
      <p className='text-textColor-second dark:text-textColor-second-dark text-center w-full md:w-1/2 mx-auto'>
        Sur Solstarter, votre contribution initiale vie au gré de votre évaluation du projet,
        Maintenez là pour conserver votre avantage à venir ou bien revendez là pour basculer sur un autre projet ; ou pour shill au restaurant 😎<br/>
        Et tout ça, grâce à au web3 et à la blockchain
      </p>
    </div>
  );
}
