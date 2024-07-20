
/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import { BN, Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { getSolstarterProgram, getSolstarterProgramId } from '../../../anchor/src';
import { redirect, useRouter } from 'next/navigation';
import { getLamportsFromSol } from '@/utils/utilsFunctions';

interface CreateUserArgs {
  signer:PublicKey
  name: string;
  bio: string;
  imageUrl: string;
}

interface CreateProjectArgs {
  userAccountPublicKey:PublicKey
  name: string,
  image_url: string,
  project_description: string,
  goal_amount: number,
  end_time: number,
  rewards: Reward[],
  userProjectCounter: number
}

interface ContributionArg {
  userAccountPublicKey: PublicKey,
  projectAccountPublicKey: PublicKey,
  amount: number
}

export function useSolstarterProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const router = useRouter()
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getSolstarterProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getSolstarterProgram(provider);

  //* QUERIES
  // function to call all the users accounts
  const usersAccounts = useQuery({
    queryKey: ['user', 'all', { cluster }],
    queryFn: () => program.account.user.all(),
  });

  // function to call all the users accounts
  const projectsAccounts = useQuery({
    queryKey: ['project', 'all', { cluster }],
    queryFn: () => program.account.project.all(),
  });

  const contributionsAccounts = useQuery({
    queryKey: ['contribution', 'all', { cluster }],
    queryFn: () => program.account.contribution.all(),
  });

  // i don't know what this function does
  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  //* MUTATIONS
  // function to create a user
  const createUser = useMutation<string,Error,CreateUserArgs>({
    // mutation key to identify the mutation
    mutationKey: ['solstarter', 'createUser', { cluster }],
    // function call from the program
    mutationFn: async ({signer,name,bio,imageUrl}) => { //the input needed by the program function
      // generation of the seeds for the PDA
      const [userEntryAddress] = await PublicKey.findProgramAddress(
        [
          Buffer.from('user'), // seeds: "user"
          signer.toBuffer(), // seeds: the user wallet public key
        ],
        programId
      )
      // call of the method
      return await program.methods.createUser(name, bio, imageUrl)
        .accountsPartial({user:userEntryAddress}) // definition of the PDA address with the seed generated
        .rpc(); // launch the transaction
    },
    onSuccess: async(signature) => {
      transactionToast(signature);
      await usersAccounts.refetch();
      router.push('/myprofile');
    },
    onError: () => toast.error('Erreur dans l\'execution du programme'),
  });

  // function to create a project
  const createProject = useMutation<string,Error,CreateProjectArgs>({
    // mutation key to identify the mutation
    mutationKey: ['solstarter', 'createProject', { cluster }],
    // function call from the program
    mutationFn: async ({userAccountPublicKey,name,image_url,project_description,goal_amount,end_time,rewards,userProjectCounter}) => { //the input needed by the program function

      // End time to unix timestamp conversion
      const endTimeUnixTimestamp = Math.floor(new Date(end_time).getTime() / 1000);

      // goal_amount is in SOL, we convert it to lamports
      const lamportsAmount = getLamportsFromSol(goal_amount);

      // generation of the seeds for the PDA
      const [newProjectAddress] = await PublicKey.findProgramAddress(
        [
          Buffer.from('project'), // seeds: "user" 
          userAccountPublicKey.toBuffer(), // seeds: the user account PDA public key
          new BN(userProjectCounter +1).toArray('le', 2) // seeds: the user project counter
        ],
        programId
      )
      console.log("counter",userProjectCounter);

      // Rewards serialization
      const serializedRewards = rewards.map((reward) => ({
        name: reward.name,
        rewardDescription: reward.rewardDescription,
        rewardAmount: reward.rewardAmount,
      }));
      
      // call of the method
      return await program.methods.createProject(name, image_url, project_description, new BN(lamportsAmount), new BN(endTimeUnixTimestamp), serializedRewards)
        .accountsPartial({user:userAccountPublicKey,project:newProjectAddress}) // definition of the PDA address with the seed generated
        .rpc(); // launch the transaction

    },
    onSuccess: (signature) => {
      transactionToast(signature);
      projectsAccounts.refetch();
      router.push('/myprofile');
    },
    onError: () => toast.error('Erreur dans l\'execution du programme'),
  });

  const addContribution = useMutation<string,Error,ContributionArg>({
    mutationKey: ['solstarter', 'addContribution', { cluster }],
    mutationFn: async ({
      userAccountPublicKey
      ,projectAccountPublicKey
      ,amount
    }) => {
      const [contributionAddress] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from('contribution'), // seeds: "contribution" 
          projectAccountPublicKey.toBuffer(), // seeds: the user account PDA public key
          userAccountPublicKey.toBuffer() // seeds: the user project counter
        ],
        programId
      )

      return await program.methods
        .addContribution(new BN(getLamportsFromSol(amount)))
        .accountsPartial({
          user:userAccountPublicKey
          ,project:projectAccountPublicKey
          ,contribution:contributionAddress
        }).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      projectsAccounts.refetch();
    },
    onError: () => toast.error('Erreur dans l\'execution du programme'),
  });

  return {
    program,
    programId,
    usersAccounts,
    createUser,
    getProgramAccount,
    projectsAccounts,
    createProject,
    addContribution,
    contributionsAccounts
  };
}
