import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { COMMUNITY_CONTRIBUTOR_PUBKEY, Solstarter, SolstarterIDL } from "@solstarter/anchor";
import { Program } from "@coral-xyz/anchor";

const defaultProject = {
    icon: "/images/fusee.jpg",
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
const contributeUrl = "/api/actions/contribute";

const network = process.env.SOLANA_RPC || 'http://127.0.0.1:8899';//'https://api.devnet.solana.com';

const getActionData = (projectId?: string, project?: Project) => {
    if (!projectId || !project) {
        return defaultProject;
    }

    return {
        icon: project.imageUrl,
        label: project.name,
        description: "Contribute to this project on Solstarter",
        title: project.name,
        links: {
            actions: [
                {
                    href: `${contributeUrl}?projectId=${projectId}&amount=${project.rewards[0].rewardAmount}`,
                    label: `${project.rewards[0].rewardAmount} SOL`
                },
                {
                    href: `${contributeUrl}?projectId=${projectId}&amount=${project.rewards[1].rewardAmount}`,
                    label: `${project.rewards[1].rewardAmount} SOL`
                },
                {
                    href: `${contributeUrl}?projectId=${projectId}&amount=${project.rewards[2].rewardAmount}`,
                    label: `${project.rewards[2].rewardAmount} SOL`
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
}

export const GET = async (req: Request) => {
    const url = new URL(req.url);
    let projectId: string | undefined;
    let projectData: Project | undefined;

    try {
        projectId = new URLSearchParams(url.search).get("projectId") || "fakeProjectId";

        const connection = new Connection(network);
        const solstarter = new Program<Solstarter>(SolstarterIDL as Solstarter, { connection })
        const project: Project = await solstarter.account.project.fetch(projectId);
        projectData = project;
    } catch (error) {
        console.log("Error while fetching the project account", projectId, error);
    }

    const payload: ActionGetResponse = getActionData(projectId, projectData);
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


        if (url.searchParams.has("amount")) {
            const val = url.searchParams.get("amount");
            try {
                amount = parseFloat(val || "0.1") || amount;
            } catch (error) {
                throw "Invalid 'amount' input";
            }
        }

        let toPubkey;

        try {
            toPubkey = new PublicKey(url.searchParams.get("projectId") || "");
            //Check that the project ID matches an existing and valid PDA
        } catch (e) {
            toPubkey = COMMUNITY_CONTRIBUTOR_PUBKEY;
        }

        const transaction = new Transaction().add(SystemProgram.transfer({
            fromPubkey: account,
            toPubkey: toPubkey,
            lamports: amount * LAMPORTS_PER_SOL
        }));

        transaction.feePayer = account;

        const connection = new Connection(network);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
                message: "Thanks for the contribution!"
            },
        })
        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });

    } catch (error) {
        console.log("ACTIONS POST ERROR =", error);
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