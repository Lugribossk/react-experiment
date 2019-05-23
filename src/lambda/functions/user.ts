import {LambdaHandler, withCors, withErrorHandling, jsonResponse} from "../Lambda";
import {withAuth} from "../LambdaAuth";

export const handler: LambdaHandler = withCors(
    withErrorHandling(
        withAuth(async event => {
            return jsonResponse(event.user);
        })
    )
);
