//tslint:disable:no-console
import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {LambdaContext, LambdaHandler, LambdaRequest} from "./Lambda";

// Serve lambda functions with Express for development.
// Run with node -r ts-node/register/transpile-only and working directory set to this dir.
// Inspired by https://github.com/netlify/netlify-lambda/blob/master/lib/serve.js

const FUNCTIONS_DIR = path.join(__dirname, "functions");
const FUNCTIONS_URL = "/.netlify/functions";

const createLambdaRequest = (request: Request): LambdaRequest => {
    return {
        path: request.path,
        httpMethod: request.method,
        queryStringParameters: request.query,
        headers: request.headers as any,
        body: request.body,
        isBase64Encoded: false,
        pathParameters: null,
        stageVariables: null,
        requestContext: null as any,
        resource: ""
    };
};

const handleRequest = async (request: Request, response: Response, handler: LambdaHandler) => {
    const lambdaContext: LambdaContext = {} as any;
    const lambdaRequest = createLambdaRequest(request);

    try {
        const lambdaResponse = await handler(lambdaRequest, lambdaContext);
        if (lambdaResponse.headers) {
            Object.entries(lambdaResponse.headers).forEach(([param, value]) => {
                response.setHeader(param, value as any);
            });
        }
        response.statusCode = lambdaResponse.statusCode;
        response.write(lambdaResponse.body);
    } catch (error) {
        console.error("Error while handling request:", error);
        response.statusCode = 500;
        response.write(error.message);
    }
    response.end();
};

const serveFunctions = (port = 9090) => {
    const app = express();
    app.use(bodyParser.text({type: "*/*"}));

    console.info("Creating endpoints for lambda function handlers:");
    fs.readdirSync(FUNCTIONS_DIR)
        .map(file => {
            return path.join(FUNCTIONS_DIR, file);
        })
        .filter(file => {
            return path.extname(file) === ".ts" && !fs.statSync(file).isDirectory();
        })
        .forEach(file => {
            const {handler} = require(file);
            if (!handler) {
                throw new Error(`An export named 'handler' was not found in ${file}.`);
            }
            const functionName = path.basename(file, ".ts");
            const functionUrl = `${FUNCTIONS_URL}/${functionName}`;

            console.info(`\t${functionUrl}`);
            app.all(functionUrl, async (request, response) => {
                await handleRequest(request, response, handler);
                console.info(`${request.method} ${request.path} ${response.statusCode}`);
            });
        });

    app.listen(port, (err: Error) => {
        if (err) {
            console.error("Unable to start:", err);
            process.exit(1);
        }
        console.info(`Server running at http://localhost:${port}`);
    });
};

serveFunctions();
