import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { clusterApiUrl, ComputeBudgetProgram, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { COMMUNITY_CONTRIBUTOR_PUBKEY, SOLSTARTER_PROGRAM_ID } from "@solstarter/anchor";

export const GET = (req: Request) => {
    const url = new URL(req.url);
    let projectId = null;
    try {
        projectId =  new URLSearchParams(url.search).get("projectId");
        /**
         * TODO Fetch project data to have a dynamic Action
         */
    } catch (error) {}

    const payload: ActionGetResponse = {
        icon: new URL("/images/fusee.jpg", url.origin).toString(),
        label: "Contribute",
        description: "Contribute to a project chosen by the community",
        title: "Solstarter - Contribute",
        links: {
            actions: [
                {
                    href: "/api/actions/contribute?amount=0.1",
                    label: "0.1 SOL"
                },
                {
                    href: "/api/actions/contribute?amount=0.5",
                    label: "0.5 SOL"
                },
                {
                    href: "/api/actions/contribute?amount=1",
                    label: "1.0 SOL"
                },
                {
                    href: "/api/actions/contribute?amount={amount}",
                    label: "Send SOL",
                    parameters: [
                        {
                            name: "amount",
                            label: "Enter a SOL amount"
                        }
                    ]
                }
            ]
        }
    }

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    });
}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const body: ActionPostRequest = await req.json();

        let account: PublicKey;

        try {
            account = new PublicKey(body.account);
        } catch (error) {
            throw "Invalid 'acccount' provided. It's not a real pubkey";
        }

        let amount: number = 0.1;

        if(url.searchParams.has("amount")) {
            const val = url.searchParams.get("amount");
            try {
                amount = parseFloat(val || "0.1") || amount;
            }catch(error) {
                throw "Invalid 'amount' input";
            }
        }

        
        const transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: account,
            toPubkey: COMMUNITY_CONTRIBUTOR_PUBKEY,
            lamports: amount * LAMPORTS_PER_SOL,
            programId: SystemProgram.programId
        }));

        transaction.add(ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 1000,
        }), {
            programId: new PublicKey(SOLSTARTER_PROGRAM_ID),
            keys: [],
        }
        )

        transaction.feePayer = account;

        const connection = new Connection(clusterApiUrl("devnet"));
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Thanks for the contribution!"
            },
            //signers: []
        })
        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

    } catch (error) {
        let message = "Unknown error";
        if (typeof error == "string") {
            message = error;
        }
        return Response.json({ message }, {
            status: 400,
            headers: ACTIONS_CORS_HEADERS
        });
    }

}