'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { WalletButton } from '../solana/solana-provider';
import GrayDisplayBlock from '../displayElements/GrayDisplayBlock';
import { useSolstarterProgram } from './myprofile-data-access';
import Link from 'next/link';
import MainButtonLabel from '../button/MainButtonLabel';
import Image from 'next/image';
import Divider from '../displayElements/Divider';
import LoaderSmall from '../displayElements/LoaderSmall';
import MainButtonLabelAsync from '../button/MainButtonLabelAsync';
import { useGetBalance } from '../account/account-data-access';

//* entry point
export function MyProfileFeature() {
  const { publicKey } = useWallet();
  const {usersAccounts,getProgramAccount,programId} = useSolstarterProgram();
  const [userAccount, setUserAccount] = useState<User | null>(null);

  // check if usersAccounts includes the user account
  useEffect(()=>{
    if (usersAccounts.data && publicKey){
      const userAccount = usersAccounts.data.find(
        (account) => account.account.walletPubkey.equals(publicKey)
      );

      if (userAccount) setUserAccount(userAccount.account as unknown as User);
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

  if (userAccount) {
    return <UserProfile user={userAccount}/>;
  }

  
  return (
    <div className='w-full md:w-1/2 mx-auto mt-24'>
      <GrayDisplayBlock padding='8'>
        <p>Il y a eu un souci...</p>
        <Link href={'/'}><MainButtonLabel label="Retourner à l'accueil"/></Link>
      </GrayDisplayBlock>
    </div>
  );

}


// element to display when no wallet is connected
export function NoWalletConnected() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return redirect(`/myprofile/${publicKey.toString()}`);
  }

  return (
    <div className='w-full md:w-1/2 mx-auto mt-24'> 
      <GrayDisplayBlock padding='8'>
        <div className='flex flex-col items-center justify-center gap-4 w-full p-8'>
          <p>Connect your wallet to access or create your solstarter account</p>
          <WalletButton/>
        </div>
      </GrayDisplayBlock>
    </div>
  );
}

// element to display when wallet is connected but no account is created
export function NoAccountCreated(){
  const {publicKey} = useWallet();
  const {createUser} = useSolstarterProgram();


  const [userToCreate, setUserToCreate] = useState({
    walletPubkey: publicKey,
    name: '',
    avatarUrl: '',
    bio: '',
    createdProjectCounter: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserToCreate((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  // on submit, launch de createUser method
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publicKey)
    createUser.mutateAsync({
      signer: publicKey,
      name: userToCreate.name,
      bio: userToCreate.bio,
      imageUrl: userToCreate.avatarUrl
    });
  };

  console.log("userToCreate",userToCreate);
  

  return (
    <div className='flex flex-col items-center justify-start gap-10 w-full md:w-1/2 mx-auto'>
      <h2 className='text-xl '>Créer votre profil solstarter</h2>
      <p></p>
      <GrayDisplayBlock padding='8'>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col w-full md:w-2/3">
            <label htmlFor="name">Mon prénom</label>
            <input
              type="text"
              placeholder='Votre prénom'
              name="name"
              id="name"
              value={userToCreate.name}
              onChange={handleChange}
              className="border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
            />
          </div>
          <div className="flex flex-col w-full md:w-2/3">
            <label htmlFor="name">Mon avatar (coller une adresse d&apos;image)</label>
            <input
              type="text"
              placeholder='URL de votre avatar'
              name="avatarUrl"
              id="avatarUrl"
              value={userToCreate.avatarUrl}
              onChange={handleChange}
              className="border border-gray-400 rounded-full p-2 text-textColor-second dark:text-textColor-second-dark"
            />
          </div>
          <div className="flex flex-col w-full md:w-2/3">
            <label htmlFor="name">A propos de moi</label>
            <textarea
              rows={4}      
              placeholder='Parlez de vous'        
              name="bio"
              id="bio"
              value={userToCreate.bio}
              onChange={handleChange}
              className="border border-gray-400 rounded-xl p-2 text-textColor-second dark:text-textColor-second-dark"
            />
          </div>
      
        <button type="submit" className='w-full md:w-1/2 my-10'><MainButtonLabelAsync label='Valider' isLoading={createUser.isPending}/></button>
      </form>
      </GrayDisplayBlock>
    </div>
  )
}



// element to display when account is created
export function UserProfile({user}:{user:any}){

  return (
    <div className='flex flex-col items-center justify-start gap-10'>
      <h2 className='text-xl '>Bonjour <span className='text-accentColor font-bold'>{user.name}</span> ! Voici votre profil solstarter</h2>
      <GrayDisplayBlock padding='8'>
        <div className='flex justify-start items-start gap-10 w-full'>
          <div className='flex flex-col items-center justify-start gap-2 '>
            {user.avatarUrl && <Image src={user.avatarUrl} alt={user.name} width={100} height={100} className='rounded-full'/>}
            <p >{user.name}</p>
          </div>
          <div className='flex flex-col items-start justify-start gap-4 w-full'>
            <p className='text-textColor-main dark:text-textColor-main-dark text-xl font-bold'>A propos de moi</p>
            <p className='text-textColor-second dark:text-textColor-second-dark'>{user.bio}</p>
            <Divider/>
            <p className='text-textColor-main dark:text-textColor-main-dark text-xl font-bold mt-10'>Mes projets</p>
          </div>
        </div>
      </GrayDisplayBlock>
    </div>
  )
}


