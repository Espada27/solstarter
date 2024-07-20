/* eslint-disable @nx/enforce-module-boundaries */
'use client';
import { BN } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import { getSolstarterProgram, getSolstarterProgramId } from '../../../anchor/src';
import { useRouter } from 'next/navigation';
import { getLamportsFromSol } from '@/utils/utilsFunctions';

/* 
 * Mutations interfaces
 */

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
  const programId = useMemo(() => getSolstarterProgramId(cluster.network as Cluster), [cluster]);
  const program = getSolstarterProgram(provider);

  /*
   *  Accounts fetching queries
  */

  // Function to fetch all the users PDA accounts
  const usersAccounts = useQuery({
    queryKey: ['user', 'all', { cluster }],
    queryFn: () => program.account.user.all(),
  });

  // Function to fetch all the projects PDA accounts
  const projectsAccounts = useQuery({
    queryKey: ['project', 'all', { cluster }],
    queryFn: () => program.account.project.all(),
  });

  // Function to fetch all the contributions PDA accounts
  const contributionsAccounts = useQuery({
    queryKey: ['contribution', 'all', { cluster }],
    queryFn: () => program.account.contribution.all(),
  });

  /**
   * Retrieves the parsed account information for a Solstarter program account.
   */
  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  /*
   * Mutations queries
   */
  
  /**
   * Creates a new user using the provided signer, name, bio, and image URL.
   * @param signer - The user's wallet signer.
   * @param name - The user's name.
   * @param bio - The user's bio.
   * @param imageUrl - The URL of the user's image.
   * @returns A Promise that resolves to the transaction signature.
   */
  const createUser = useMutation<string, Error, CreateUserArgs>({
    mutationKey: ['solstarter', 'createUser', { cluster }],
    mutationFn: async ({ signer, name, bio, imageUrl }) => {
      const [userEntryAddress] = await PublicKey.findProgramAddress(
        [
          Buffer.from('user'),
          signer.toBuffer(),
        ],
        programId
      );
      return await program.methods.createUser(name, bio, imageUrl)
        .accountsPartial({ user: userEntryAddress })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      usersAccounts.refetch();
      router.push('/myprofile');
    },
    onError: () => toast.error('Erreur dans l\'execution du programme'),
  });

  /**
   * Creates a new project using the Solstarter program.
   * 
   * @param userAccountPublicKey - The public key of the user's account.
   * @param name - The name of the project.
   * @param image_url - The URL of the project's image.
   * @param project_description - The description of the project.
   * @param goal_amount - The goal amount of the project.
   * @param end_time - The end time of the project.
   * @param rewards - The rewards associated with the project.
   * @param userProjectCounter - The user's project counter used in seed.
   * 
   * @returns A Promise that resolves to the result of the createProject method call.
   */
  const createProject = useMutation<string, Error, CreateProjectArgs>({
    mutationKey: ['solstarter', 'createProject', { cluster }],
    mutationFn: async ({
      userAccountPublicKey,
      name,
      image_url,
      project_description,
      goal_amount,
      end_time,
      rewards,
      userProjectCounter
    }) => {

      // Convert the end_time to Unix timestamp, milliseconds to seconds
      const endTimeUnixTimestamp = Math.floor(new Date(end_time).getTime() / 1000);

      // Convert the goal_amount to lamports
      const lamportsAmount = getLamportsFromSol(goal_amount);
      
      // Build the seeds for the new project address
      const [newProjectAddress] = await PublicKey.findProgramAddress(
        [
          Buffer.from('project'),
          userAccountPublicKey.toBuffer(),
          new BN(userProjectCounter + 1).toArray('le', 2) // Number conversion to little-endian buffer, 2 bytes for 8 bits
        ],
        programId
      )

      // Serialize the rewards for compatibility with the program
      const serializedRewards = rewards.map((reward) => ({
        name: reward.name,
        rewardDescription: reward.rewardDescription,
        rewardAmount: reward.rewardAmount,
      }));
      
      // Call the createProject method of the Solstarter program
      return await program.methods.createProject(
        name,
        image_url,
        project_description,
        new BN(lamportsAmount),
        new BN(endTimeUnixTimestamp),
        serializedRewards
      )
        .accountsPartial({ user: userAccountPublicKey, project: newProjectAddress })
        .rpc();
    },
    onSuccess: (signature, newProjectAddress) => {
      transactionToast(signature);
      projectsAccounts.refetch();
      usersAccounts.refetch();
      router.push(`/projects/${newProjectAddress.toString()}`);
    },
    onError: () => toast.error('Erreur dans l\'execution du programme'),
  });

  
  /**
   * Adds a contribution to a Solstarter project.
   *
   * @param userAccountPublicKey - The public key of the user's account.
   * @param projectAccountPublicKey - The public key of the project's account.
   * @param amount - The amount of the contribution.
   * @returns A Promise that resolves to the result of the addContribution operation.
   */
  const addContribution = useMutation<string,Error,ContributionArg>({
    mutationKey: ['solstarter', 'addContribution', { cluster }],
    mutationFn: async ({
      userAccountPublicKey
      ,projectAccountPublicKey
      ,amount
    }) => {

      // Seeds building
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
    onSuccess: (signature, projectAccountPublicKey) => {
      transactionToast(signature);
      contributionsAccounts.refetch();
      projectsAccounts.refetch();
      usersAccounts.refetch();
      router.push(`
        /projects/${projectAccountPublicKey.toString()}
      `);
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
  };
}
