import {LambdaHandler, withCors, withErrorHandling, FUNCTIONS_URL} from "../Lambda";
import {createAuthToken} from "../LambdaAuth";

export const handler: LambdaHandler = withCors(
    withErrorHandling(async event => {
        const token = createAuthToken(event.body);
        return {
            statusCode: 200,
            headers: {
                "Set-Cookie": `authorization=${token}; Path=${FUNCTIONS_URL}/; Max-Age=86400; HttpOnly; SameSite=Lax`
            },
            body: ""
        };
    })
);
