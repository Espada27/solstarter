import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = () => {

    const payload: ActionsJson = {
        rules: [
            {
                pathPattern: "/now",
                apiPath: "/api/actions/contribute",

            }
        ]
    }

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    });
}

export const OPTIONS = GET;

