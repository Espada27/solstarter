import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Solstarter } from './../target/types/solstarter';
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { User, Project } from "./types";
import { userData1, userData2, userData3, projectData1, projectData2, projectData3 } from "./datasets";
import { INIT_BALANCE, confirmTransaction } from "./testUtils";

describe("solstarter", () => {
  const systemProgram = anchor.web3.SystemProgram;
  
  async function create_wallet_with_sol() : Promise<Keypair> {
    const wallet = new Keypair()
    const tx = await program.provider.connection.requestAirdrop(wallet.publicKey, INIT_BALANCE);
    await program.provider.connection.confirmTransaction(tx);
    return wallet
  }

  // Create a new project
  async function create_user_pda(userData: User, wallet: Keypair) : Promise<PublicKey> {
    
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
  ) : Promise<PublicKey> {
      
    // Seeds building
    const seeds = [
      Buffer.from("project"),
      userPubkey.toBuffer(),
      new anchor.BN(userProjectCounter + 1).toArray('le', 2),
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
          projectData.goal_amount,
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

    async function contribute(signerWallet: Keypair, fromUser: PublicKey, forProject: PublicKey, depositAmount: number): Promise<PublicKey> {
        
        const toContribution = await create_contribution_pda(fromUser, forProject);

        const tx = await program.methods.addContribution(new BN(depositAmount))
        .accountsPartial({
          user: fromUser,
          project: forProject,
          contribution: toContribution,
          walletPubkey: signerWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([signerWallet])
        .rpc();

        // Confirm the transaction
        await confirmTransaction(program, tx);

        return toContribution
    }

    async function withdraw(fromProject: PublicKey, toSignerWallet: Keypair) {
        // Execute the transaction
        const tx = await program.methods
            .withdraw()
            .accountsPartial({
                project: fromProject,
                ownerPubkey: toSignerWallet.publicKey,
            })
            .signers([toSignerWallet])
            .rpc();

        // Confirm the transaction
        await confirmTransaction(program, tx);
    }

  const program = anchor.workspace.Solstarter as Program<Solstarter>;

  let wallet1, wallet2, wallet3: Keypair;	// owners userPda1 and userPda2
  let userPk1, userPk2, userPk3: PublicKey;	// userPda1 and userPda2
  let projectPk1: PublicKey;	// projectPda1, projectPda2 and projectPda3 
  let contributionPk1, contributionPk2, contributionPk3: PublicKey;	// contributionPda1, contributionPda2 and contributionPda3
  let fetchedUser1, fetchedProject1;


  it("should create 1 project and 1 contribution", async () => {

    // New wallet + airdrop
    wallet1 = await create_wallet_with_sol(); // Project Owner 
    wallet2 = await create_wallet_with_sol(); // Contributor 1
    wallet3 = await create_wallet_with_sol(); // Contributor 2

    // Create user1
    userPk1 = await create_user_pda(userData1, wallet1);
    userPk2 = await create_user_pda(userData2, wallet2);
    userPk3 = await create_user_pda(userData3, wallet3);

    // Fetch user1 and user2
    fetchedUser1 = await program.account.user.fetch(userPk1);

    // Create project
    projectPk1 = await create_project_pda(
        projectData1,
        fetchedUser1.createdProjectCounter,
        userPk1,
        wallet1
    );

    // Send contributions
    contributionPk1 = await contribute(wallet2, userPk2, projectPk1, 600 * LAMPORTS_PER_SOL);
    const fetchedContribution = await program.account.contribution.fetch(contributionPk1);
    fetchedProject1 = await program.account.project.fetch(projectPk1);
    
    expect(anchor.BN(fetchedContribution.amount).toNumber()).toEqual(600 * LAMPORTS_PER_SOL);
    expect(anchor.BN(fetchedProject1.raisedAmount).toNumber()).toEqual(600 * LAMPORTS_PER_SOL);
  });

  it("should failed to withdraw by raised amount error", async () => {
    
    // Withdraw funds
    const wallet1BalanceBeforeWithdraw = await program.provider.connection.getBalance(wallet1.publicKey);
    const project1BalanceBeforeWithdraw = await program.provider.connection.getBalance(projectPk1);

    // Withdraw funds
    try {
      await withdraw(projectPk1, wallet1);
    } catch (err) {
      expect(err).toHaveProperty("error");
      expect(err.error.errorCode.code).toEqual("UnreachedGoalAmount");
    }
    
    fetchedProject1 = await program.account.project.fetch(projectPk1);

    // Check wallet1 balance
    const wallet1BalanceAfter = await program.provider.connection.getBalance(wallet1.publicKey);
    const project1BalanceAfter = await program.provider.connection.getBalance(projectPk1);

    // Wallet1 should have 
    expect(anchor.BN(fetchedProject1.raisedAmount).toNumber()).toEqual(600 * LAMPORTS_PER_SOL);
    expect(wallet1BalanceAfter).toEqual(wallet1BalanceBeforeWithdraw);
    expect(project1BalanceAfter).toEqual(project1BalanceBeforeWithdraw);
  });

  it("should contribute to reach goal amount", async () => {

    // Create contributions    
    contributionPk2 = await contribute(wallet3, userPk3, projectPk1, 400 * LAMPORTS_PER_SOL);
    fetchedProject1 = await program.account.project.fetch(projectPk1);
    expect(anchor.BN(fetchedProject1.raisedAmount).toNumber()).toEqual((600 + 400) * LAMPORTS_PER_SOL);
  });

  it("should failed to withdraw by ownership error", async () => {

    const walletBalanceBeforeWithdraw = await program.provider.connection.getBalance(wallet2.publicKey);
    const project1BalanceBeforeWithdraw = await program.provider.connection.getBalance(projectPk1);

    // Withdraw funds
    try {
      await withdraw(projectPk1, wallet2);
    } catch (err) {
      expect(err).toHaveProperty("error");
      expect(err.error.errorCode.code).toEqual("ConstraintHasOne");
    }

    fetchedProject1 = await program.account.project.fetch(projectPk1);

    // Check wallet1 balance
    const walletBalanceAfter = await program.provider.connection.getBalance(wallet2.publicKey);
    const project1BalanceAfter = await program.provider.connection.getBalance(projectPk1);

    // Wallet1 should have 
    expect(anchor.BN(fetchedProject1.raisedAmount).toNumber()).toEqual((600 + 400) * LAMPORTS_PER_SOL);
    expect(walletBalanceAfter).toEqual(walletBalanceBeforeWithdraw);
    expect(project1BalanceAfter).toEqual(project1BalanceBeforeWithdraw);
  });
  
  it("should success to withdraw", async () => {
 
    const walletBalanceBeforeWithdraw = await program.provider.connection.getBalance(wallet1.publicKey);
    const project1BalanceBeforeWithdraw = await program.provider.connection.getBalance(projectPk1);

    // Withdraw funds
    await withdraw(projectPk1, wallet1);

    fetchedProject1 = await program.account.project.fetch(projectPk1);

    // Check wallet1 balance
    const walletBalanceAfter = await program.provider.connection.getBalance(wallet1.publicKey);
    const project1BalanceAfter = await program.provider.connection.getBalance(projectPk1);

    // Should be 0 on local test validator
    const txCost = walletBalanceAfter - walletBalanceBeforeWithdraw - (1000 * LAMPORTS_PER_SOL);

    // Wallet1 should have 
    expect(walletBalanceAfter).toEqual(walletBalanceBeforeWithdraw + (1000 * LAMPORTS_PER_SOL) - txCost);
    expect(project1BalanceAfter).toEqual(project1BalanceBeforeWithdraw - (1000 * LAMPORTS_PER_SOL));
  });

  it("should fail to contribute on project", async () => {

    const walletBalanceBefore = await program.provider.connection.getBalance(wallet3.publicKey);
    
    // Create contribution
    try {
      await contribute(wallet3, userPk3, projectPk1, 10 * LAMPORTS_PER_SOL);
    } catch (err) {
      expect(err).toHaveProperty("error");
      expect(err.error.errorCode.code).toEqual("ProjectNotOngoing");
    }
    const walletBalanceAfter = await program.provider.connection.getBalance(wallet3.publicKey);
    expect(walletBalanceAfter).toEqual(walletBalanceBefore);

    fetchedProject1 = await program.account.project.fetch(projectPk1);
    expect(anchor.BN(fetchedProject1.raisedAmount).toNumber()).toEqual((600 + 400) * LAMPORTS_PER_SOL);
    
  });
});
