import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Solstarter } from './../target/types/solstarter';
import { LAMPORTS_PER_SOL, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { User, Project } from "./types";
import { userData1, userData2, projectData1, projectData2, projectData3 } from "./datasets";
import { log } from "console";

describe("solstarter", () => {
  const systemProgram = anchor.web3.SystemProgram;
  
  async function create_wallet_with_sol() : Promise<Keypair> {
    const wallet = new Keypair()
    const tx = await program.provider.connection.requestAirdrop(wallet.publicKey, 1000 * LAMPORTS_PER_SOL);
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
      new anchor.BN(userProjectCounter + 1).toArrayLike(Buffer, "le", 2),
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
          Math.floor(projectData.created_time / 1000),
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

  const program = anchor.workspace.Solstarter as Program<Solstarter>;

  let wallet1, wallet2: Keypair;	// owners userPda1 and userPda2
  let userPk1, userPk2: PublicKey;	// userPda1 and userPda2
  let projectPk1, projectPk2, projectPk3: PublicKey;	// projectPda1, projectPda2 and projectPda3

  it("should create 2 new user account", async () => {
    // New wallet + airdrop
    wallet1 = await create_wallet_with_sol();
    wallet2 = await create_wallet_with_sol();

    // Create user1
    userPk1 = await create_user_pda(userData1, wallet1);
    userPk2 = await create_user_pda(userData2, wallet2);

    // Fetch user1 and user2
    const fetchedUser1 = await program.account.user.fetch(userPk1);
    const fetchedUser2 = await program.account.user.fetch(userPk2);

    // Check if the data is correct
    expect(fetchedUser1.walletPubkey.toString()).toEqual(wallet1.publicKey.toString());
    expect(fetchedUser1.name).toEqual(userData1.name);
    expect(fetchedUser1.bio).toEqual(userData1.bio);
    expect(fetchedUser1.avatarUrl).toEqual(userData1.avatar_url);
    expect(fetchedUser1.createdProjectCounter).toEqual(0);

    expect(fetchedUser2.walletPubkey.toString()).toEqual(wallet2.publicKey.toString());
    expect(fetchedUser2.name).toEqual(userData2.name);
    expect(fetchedUser2.bio).toEqual(userData2.bio);
    expect(fetchedUser2.avatarUrl).toEqual(userData2.avatar_url);
    expect(fetchedUser2.createdProjectCounter).toEqual(0);
  });

  it("should create 3 new projects", async () => {
    
    //Fetch user1 and user2
    let fetchedUser1 = await program.account.user.fetch(userPk1);

    projectPk1 = await create_project_pda(
      projectData1,
      fetchedUser1.createdProjectCounter,
      userPk1,
      wallet1
    );

    // Update user 1 datas
    fetchedUser1 = await program.account.user.fetch(userPk1);

    projectPk2 = await create_project_pda(
      projectData2,
      fetchedUser1.createdProjectCounter,
      userPk1,
      wallet1
    );

    const fetchedUser2 = await program.account.user.fetch(userPk2);

    projectPk3 = await create_project_pda(
      projectData3,
      fetchedUser2.createdProjectCounter,
      userPk2,
      wallet2
    );

  });
});
