import {LambdaHandler, withCors, withErrorHandling, jsonResponse, withAuth} from "../Lambda";

export const handler: LambdaHandler = withErrorHandling(
    withCors(
        withAuth(async event => {
            return jsonResponse(event.user);
        })
    )
);
