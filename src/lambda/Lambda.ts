//tslint:disable:no-console
import User from "../auth/User";

// We don't want to install or depend on the actual aws-lamda package, but we do want the types.
export type LambdaRequest = import("aws-lambda").APIGatewayProxyEvent;
export type LambdaResponse = import("aws-lambda").APIGatewayProxyResult;
export type LambdaContext = import("aws-lambda").Context;
// The built-in APIGatewayProxyHandler definition for handler functions allows both callback and async style,
// so define and use our own version that only allows async.
export type LambdaHandler<Request = LambdaRequest, Response = LambdaResponse> = (
    event: Request,
    context: LambdaContext
) => Promise<Response>;

export const jsonResponse = (data: any, status = 200): LambdaResponse => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
};

export const withCors = (handler: LambdaHandler): LambdaHandler => {
    return async (event, context) => {
        const allRequests = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "Content-Length,ETag"
        };
        if (event.httpMethod.toUpperCase() === "OPTIONS") {
            console.log("cors options response");
            return {
                statusCode: 204,
                // headers: {
                //     ...allRequests,
                //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
                //     "Access-Control-Allow-Headers":
                //         "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,If-None-Match",
                //     "Access-Control-Max-Age": "172800",
                //     "Content-Length": 0
                // },
                body: ""
            };
        }
        const response = await handler(event, context);

        return {
            ...response,
            headers: {
                ...response.headers,
                ...allRequests
            }
        };
    };
};

export const withErrorHandling = (handler: LambdaHandler): LambdaHandler => {
    return async (event, context) => {
        try {
            return handler(event, context);
        } catch (error) {
            console.log("Error while handling request:", error);
            return jsonResponse(
                {
                    status: 500,
                    message: `Internal server error: ${error.message}`
                },
                500
            );
        }
    };
};

export const withAuth = (handler: LambdaHandler<LambdaRequest & {user: User}>): LambdaHandler => {
    return async (event, context) => {
        if (!event.headers.authorization) {
            return jsonResponse(
                {
                    status: 401,
                    message: "Credentials are required to access this resource."
                },
                401
            );
        }
        return handler({...event, user: new User({fullName: "Test", email: "test"})}, context);
    };
};
