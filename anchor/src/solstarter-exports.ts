// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import SolstarterIDL from '../target/idl/solstarter.json';
import type { Solstarter } from '../target/types/solstarter';

// Re-export the generated IDL and type
export { Solstarter, SolstarterIDL };

// The programId is imported from the program IDL.
export const SOLSTARTER_PROGRAM_ID = new PublicKey(SolstarterIDL.address)

// This is a helper function to get the Solstarter Anchor program.
export function getSolstarterProgram(provider: AnchorProvider) {
  return new Program(SolstarterIDL as Solstarter, provider);
}

// This is a helper function to get the program ID for the Docsig program depending on the cluster.
export function getSolstarterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOLSTARTER_PROGRAM_ID
  }
}