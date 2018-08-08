import {LambdaHandler, withCors, withErrorHandling, jsonResponse, withAuth} from "../Lambda";

export const handler: LambdaHandler = withCors(
    withErrorHandling(
        withAuth(async event => {
            return jsonResponse(event.user);
        })
    )
);
