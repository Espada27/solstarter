import { PublicKey } from "@solana/web3.js";

type AccountWrapper<T> = {
    publicKey: PublicKey;
    account: T;
  };

 export function extractAccountsData<T>(array: AccountWrapper<T>[]): T[] {
    return array.map(({ account }) => ({ ...account }));
  }