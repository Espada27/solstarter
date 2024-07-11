import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solstarter } from "../target/types/solstarter";

describe("solstarter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Solstarter as Program<Solstarter>;

  it("should run the program", async () => {
    // Add your test here.
    const tx = await program.methods.greet().rpc();
    console.log("Your transaction signature", tx);
  });
});
