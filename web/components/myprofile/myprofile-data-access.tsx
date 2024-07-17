'use client';
import { Program } from '@coral-xyz/anchor';
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


interface CreateUserArgs {
  signer:PublicKey
  name: string;
  bio: string;
  imageUrl: string;
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

  // function to call all the users accounts
  const usersAccounts = useQuery({
    queryKey: ['user', 'all', { cluster }],
    queryFn: () => program.account.user.all(),
  });

  // i don't know what this function does
  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

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
        .accounts({user:userEntryAddress}) // definition of the PDA address with the seed generated
        .rpc(); // launch the transaction
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      usersAccounts.refetch();
      router.push('/myprofile');
    },
    onError: () => toast.error('Failed to run program'),
  });

  return {
    program,
    programId,
    usersAccounts,
    createUser,
    getProgramAccount
  };
}
