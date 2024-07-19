import * as anchor from "@coral-xyz//anchor";
import { BN, Program } from "@coral-xyz//anchor";
import { Solstarter } from "../src";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL, TransactionConfirmationStrategy, BaseTransactionConfirmationStrategy, BlockheightBasedTransactionConfirmationStrategy } from "@solana/web3.js";
import { Project, User } from "./types";
import { userData1, projectData1} from "./datasets";
import { confirmTransaction } from "./testUtils";

describe("add_contribution", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const systemProgram = anchor.web3.SystemProgram;
  anchor.setProvider(provider);

  const program = anchor.workspace.Solstarter as Program<Solstarter>;

  /*let user: Keypair;
  let project: Keypair;
  let contribution: PublicKey;
  let projectAccount: any;*/

  //
  // Init functions
  //
  async function create_wallet_with_sol(): Promise<Keypair> {
    const wallet = new Keypair()
    const tx = await program.provider.connection.requestAirdrop(wallet.publicKey, 1000 * LAMPORTS_PER_SOL);
    await program.provider.connection.confirmTransaction(tx);
    return wallet
  }

  // Create a new project
  async function create_user_pda(userData: User, wallet: Keypair): Promise<PublicKey> {
    const [userPdaPublicKey] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user"), wallet.publicKey.toBuffer()],
      program.programId
    );

    // Call the createUser method
    const createUserTx = await program.methods
      .createUser(userData.name, userData.bio, userData.avatar_url)
      .accountsPartial({
        signer: wallet.publicKey,
        user: userPdaPublicKey,
        systemProgram: systemProgram.programId,
      })
      .signers([wallet])
      .rpc();
    await program.provider.connection.confirmTransaction(createUserTx);
    return userPdaPublicKey;
  }

  // Create a new project
  async function create_project_pda(
    projectData: Project,
    userProjectCounter: number,
    userPubkey: PublicKey,
    wallet: Keypair
  ): Promise<PublicKey> {

    // Seeds building
    const seeds = [
      Buffer.from("project"),
      userPubkey.toBuffer(),
      new BN(userProjectCounter + 1).toArray('le', 2),
    ];

    // Project Pda address research with seeds
    const [projectPdaPublicKey] = await PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    // Rewards serialization
    const serializedRewards = projectData.rewards.map((reward) => ({
      name: reward.name,
      rewardDescription: reward.description,
      rewardAmount: reward.required_amount,
    }));

    // Call the createProject method
    const createTx = await program.methods
      .createProject(
        projectData.name,
        projectData.image_url,
        projectData.project_description,
        new BN(Math.floor(projectData.created_time / 1000)),
        new BN(Math.floor(projectData.end_time / 1000)),
        serializedRewards
      )
      .accountsPartial({
        user: userPubkey,
        project: projectPdaPublicKey,
        signer: wallet.publicKey,
      })
      .signers([wallet])
      .rpc();

    await program.provider.connection.confirmTransaction(createTx);

    return projectPdaPublicKey;
  }

  async function create_contribution_pda(userPdaKey: PublicKey, projectPdaKey: PublicKey): Promise<PublicKey> {
    const [contributionPdaKey] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("contribution"), projectPdaKey.toBuffer(), userPdaKey.toBuffer()],
      program.programId
    );
    return contributionPdaKey;
  }

  it("should successfully add a new contribution", async () => {
    const userWallet = await create_wallet_with_sol();
    const userPdaKey = await create_user_pda(userData1, userWallet);
    const projectPdaKey = await create_project_pda(projectData1, userData1.created_project_counter, userPdaKey, userWallet)
    const contributionPdaKey = await create_contribution_pda(userPdaKey, projectPdaKey);
    const depositAmount = new BN(100 * LAMPORTS_PER_SOL);

    const signerBalanceBefore = await provider.connection.getBalance(userWallet.publicKey);

    const tx = await program.methods.addContribution(depositAmount)
      .accountsPartial({
        user: userPdaKey,
        project: projectPdaKey,
        contribution: contributionPdaKey,
        signer: userWallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([userWallet])
      .rpc();

    await confirmTransaction(program, tx);

    const contributionAccount = await program.account.contribution.fetch(contributionPdaKey);

    const signerBalanceAfter = await provider.connection.getBalance(userWallet.publicKey);
    const txCost = signerBalanceBefore - signerBalanceAfter - depositAmount;

    expect(signerBalanceAfter).toEqual(signerBalanceBefore - depositAmount - txCost);
    expect(contributionAccount.amount.toString()).toEqual(depositAmount.toString());
    expect(contributionAccount.userPubkey.toString()).toEqual(userPdaKey.toString());
    expect(contributionAccount.projectPubkey.toString()).toEqual(projectPdaKey.toString());
  });

  it("should update an existing contribution", async () => {
    
  });

  it("should fail when project is not ongoing", async () => {
    
  });
});