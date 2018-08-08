import {LambdaHandler, withCors, withErrorHandling, jsonResponse} from "../Lambda";

export const handler: LambdaHandler = withCors(
    withErrorHandling(async event => {
        return jsonResponse({
            accessToken: "12345"
        });
    })
);
