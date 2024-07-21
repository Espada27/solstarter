'use client';
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import GrayDisplayBlock from "../displayElements/GrayDisplayBlock";
import { WalletButton } from "../solana/solana-provider";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import { useState } from "react";
import MainButtonLabelAsync from "../button/MainButtonLabelAsync";
import MainButtonLabel from "../button/MainButtonLabel";
import Image from "next/image";
import Link from "next/link";
import ProjectCard from "../cards/ProjectCard";
import ContributionCard from "../cards/ContributionCard";



//* element to display when no wallet is connected
export function NoWalletConnected() {
    const { publicKey } = useWallet();
  
    if (publicKey) {
      return redirect(`/myprofile/${publicKey.toString()}`);
    }
  
    return (
      <div className='w-full md:w-1/2 mx-auto mt-24'> 
        <GrayDisplayBlock padding='8'>
          <div className='flex flex-col items-center justify-center gap-4 w-full p-8'>
            <p className="text-center">Connectez votre wallet pour accéder à votre profil solstarter ou en créer un</p>
            <WalletButton/>
          </div>
        </GrayDisplayBlock>
      </div>
    );
  }



//* element to display when wallet is connected but no account is created
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
  
    //* TEST
    // console.log("userToCreate",userToCreate);
    
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


//* Profile tab
export function ProfileTab({user}:{user:User}){
    return (
        <GrayDisplayBlock padding='8'>
        <div className='flex justify-start items-start gap-10 w-full'>
          <div className='flex flex-col items-center justify-start gap-2'>
            {user.avatarUrl && <Image src={user.avatarUrl} alt={user.name} width={100} height={100} className='rounded-full'/>}
            <p className='text-center'>{user.name}</p>
          </div>
          <div className='flex flex-col items-start justify-start gap-4 w-full'>
            <p className='text-textColor-main dark:text-textColor-main-dark text-xl font-bold'>A propos de moi</p>
            <div className='flex justify-between items-center gap-10 w-full'>
              <p className='text-textColor-second dark:text-textColor-second-dark'>{user.bio}</p>
              <Link href={'/createproject'} className='w-1/3'><MainButtonLabel label='Proposer un projet'/></Link>
            </div>
          </div>
        </div>
      </GrayDisplayBlock>
    )
}



//* Project tab
export function ProjectsTab({userProjects}:{userProjects:AccountWrapper<Project>[]}){
    return (
        <GrayDisplayBlock padding='8'>
        <div className='flex flex-col items-start justify-start gap-4 w-full'>
          <p className='text-textColor-main dark:text-textColor-main-dark text-xl font-bold'>Mes projets</p>
          {userProjects && userProjects.length === 0 && <p className="text-textColor-second dark:text-textColor-second-dark">Vous n&apos;avez pas encore créé de projet</p>}
          <div 
            className="grid gap-20  w-full justify-center"
            style={{gridTemplateColumns:"repeat(auto-fit,minmax(420px,auto)"}} // handle automatic number of column in responsive>
          >
            {userProjects && userProjects.map((project, index) => (
              <ProjectCard key={index} project={project.account} projectAccountPubkey={project.publicKey}/>
            ))}
          </div>
        </div>
      </GrayDisplayBlock>
    )
}


//* Contributions tab
export function ContributionsTab({userContributions}:{userContributions:AccountWrapper<Contribution>[]}){
    return (
        <GrayDisplayBlock padding='8'>
        <div className='flex flex-col items-start justify-start gap-4 w-full'>
          <p className='text-textColor-main dark:text-textColor-main-dark text-xl font-bold'>Mes contributions</p>
          {userContributions && userContributions.length === 0 && 
            <p className="text-textColor-second dark:text-textColor-second-dark">Vous n&apos;avez pas encore contribué à un projet</p>
          }
          {userContributions && userContributions.map((contribution, index) => (
            <ContributionCard key={index} contributions={contribution.account}/>
          ))}
          </div>
      </GrayDisplayBlock>
    )
}



  