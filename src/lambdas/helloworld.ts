export const handler: AWSLambda.APIGatewayProxyHandler = async () => {
    return {
        statusCode: 200,
        body: "Hello world"
    };
};
