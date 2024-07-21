'use client';
import React, { useEffect, useState } from 'react';
import GrayDisplayBlock from '../displayElements/GrayDisplayBlock';

import Link from 'next/link';
import MainButtonLabel from '../button/MainButtonLabel';
import LoaderSmall from '../displayElements/LoaderSmall';
import { useSolstarterProgram } from '../solstarter/solstarter-data-access';
import { PublicKey } from '@solana/web3.js';
import { ContributionsTab, NoAccountCreated, NoWalletConnected, ProfileTab, ProjectsTab } from './myprofile-ui';
import { useWallet } from '@solana/wallet-adapter-react';

//* entry point
export function MyProfileFeature() {
  const { publicKey } = useWallet();
  const {usersAccounts,getProgramAccount} = useSolstarterProgram();
  const [userAccount, setUserAccount] = useState<User | null>(null);
  const[userAccountPublicKey,setUserAccountPublicKey] = useState<PublicKey | null>(null);

  // check if usersAccounts includes the user account
  useEffect(()=>{
    if (usersAccounts.data && publicKey){
      const userAccountData = usersAccounts.data.find(
        (account) => account.account.walletPubkey.equals(publicKey)
      );

      if (userAccountData) setUserAccount(userAccountData.account as unknown as User);
      if(userAccountData) setUserAccountPublicKey(userAccountData.publicKey);
    }
  },[usersAccounts.data?.values,publicKey])

  

  if (!publicKey) {
    return <NoWalletConnected />;
  }

  if (usersAccounts.isLoading || getProgramAccount.isLoading) {
    return <LoaderSmall/>;
  }

  if (!userAccount) {
    return <NoAccountCreated />;
  }

  if (userAccount && userAccountPublicKey){ 
    return <UserProfile user={userAccount} userAccountPublicKey={userAccountPublicKey}/>;
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
  );

}


// element to display when account is created
export function UserProfile({user,userAccountPublicKey}:{user:User,userAccountPublicKey:PublicKey}) {
  const {projectsAccounts,contributionsAccounts} = useSolstarterProgram();
  const [userProjects, setUserProjects] = useState<AccountWrapper<Project>[]>([]);
  const [userContributions, setUserContributions] = useState<AccountWrapper<Contribution>[]>([]);
  const [menuSelection, setMenuSelection] = useState<'profile' | 'projects' | 'contributions'>('profile');

  // fetch the user projects and contributions
  useEffect(()=>{
    // projects
    if (userAccountPublicKey && projectsAccounts.data){
      const userProjectsData = projectsAccounts.data.filter(
        (project) => project.account.userPubkey.equals(userAccountPublicKey)
      );

      if (userProjectsData) setUserProjects(userProjectsData);

    }
    //contributions
    if(userAccountPublicKey && contributionsAccounts.data){
      const userContributions = contributionsAccounts.data.filter(
        (contribution) => contribution.account.userPubkey.equals(userAccountPublicKey)
      ); 

      if (userContributions) setUserContributions(userContributions);
    }
  },[userAccountPublicKey,projectsAccounts.data,contributionsAccounts.data]);

  //* TEST
  // console.log("projectsAccounts",projectsAccounts);
  // console.log("userProjects",userProjects);
  // console.log("userAccountPublicKey",userAccountPublicKey);
  console.log("userContributions",userContributions);
  
  

  return (
    <div className='flex flex-col items-center justify-start gap-4'>
      <h2 className='text-xl font-bold mb-6'>Bonjour <span className='text-accentColor font-bold'>{user.name}</span> ! Voici votre profil solstarter</h2>
      <GrayDisplayBlock padding='4'>
        <div className='grid grid-cols-3 gap-2 w-full'>
          <button className={`btn btn-ghost text-textColor-second  ${menuSelection === 'profile' ? "bg-gray-800 text-textColor-main dark:text-textColor-main-dark":""}`} onClick={()=>setMenuSelection("profile")}>Mon profil</button>
          <button className={`btn btn-ghost text-textColor-second  ${menuSelection === 'projects' ? "bg-gray-800 text-textColor-main dark:text-textColor-main-dark":""}`} onClick={()=>setMenuSelection("projects")}>Mes projets</button>
          <button className={`btn btn-ghost text-textColor-second  ${menuSelection === 'contributions' ? "bg-gray-800 text-textColor-main dark:text-textColor-main-dark":""}`} onClick={()=>setMenuSelection("contributions")}>Mes contributions</button>
        </div>
      </GrayDisplayBlock>
      {menuSelection === 'profile' && <ProfileTab user={user}/>}
      {menuSelection === 'projects' && <ProjectsTab userProjects={userProjects}/>}
      {menuSelection === 'contributions' && <ContributionsTab userContributions={userContributions}/>}
    </div>
  )
}


