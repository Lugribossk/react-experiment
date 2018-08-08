import {LambdaHandler} from "../Lambda";

export const handler: LambdaHandler = async () => {
    return {
        statusCode: 200,
        body: "Hello world"
    };
};
