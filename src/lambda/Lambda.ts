//tslint:disable:no-console no-implicit-dependencies

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

export const FUNCTIONS_URL = "/.netlify/functions";

export const jsonResponse = (data: any, status = 200, headers: any = {}): LambdaResponse => {
    return {
        statusCode: status,
        headers: {
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(data)
    };
};

export const withCors = (handler: LambdaHandler): LambdaHandler => {
    return async (event, context) => {
        const allRequests = {
            "Access-Control-Allow-Origin": event.headers.origin,
            "Access-Control-Expose-Headers": "Content-Length,ETag",
            "Access-Control-Allow-Credentials": true
        };
        if (event.httpMethod.toUpperCase() === "OPTIONS") {
            console.info(event.httpMethod);
            return {
                statusCode: 204,
                headers: {
                    ...allRequests,
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
                    "Access-Control-Allow-Headers":
                        "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin,If-None-Match",
                    "Access-Control-Max-Age": "172800"
                },
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
