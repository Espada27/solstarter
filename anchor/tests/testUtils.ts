import { BlockheightBasedTransactionConfirmationStrategy, RpcResponseAndContext, SignatureResult, TransactionSignature } from "@solana/web3.js";
import {  Idl, Program } from "@coral-xyz//anchor";
import { Solstarter } from "../src";

export const confirmTransaction = async (program: Program<Solstarter>, tx: TransactionSignature): Promise<RpcResponseAndContext<SignatureResult>>  => {
    const latestBlockhash = await program.provider.connection.getLatestBlockhash();
    const confirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = { ...latestBlockhash, signature: tx };

    return await program.provider.connection.confirmTransaction(confirmationStrategy, "confirmed");
}