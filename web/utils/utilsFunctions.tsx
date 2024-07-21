import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

type AccountWrapper<T> = {
    publicKey: PublicKey;
    account: T;
  };

export function extractAccountsData<T>(array: AccountWrapper<T>[]): T[] {
  return array.map(({ account }) => ({ ...account }));
}

export function getLamportsFromSol(sol: number) {
  return sol * LAMPORTS_PER_SOL;
}

export function getSolFromLamports(lamports: number) {
    return lamports / LAMPORTS_PER_SOL;
}

export const getValidUrl = (url: string): string => {
  return url.includes('/') ? url : '';
}

export const millisecondsToDays = (milliseconds: number) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(milliseconds / millisecondsPerDay);
};
