import jwt from "jsonwebtoken";
import User from "../auth/User";
import {jsonResponse, LambdaHandler, LambdaRequest} from "./Lambda";

const ALGORITHM = "HS256";
const SECRET = "TODO";
const ISSUER = "TODO";

const signToken = (subject: string, payload: ({[key: string]: string}) = {}) => {
    return jwt.sign(payload, SECRET, {
        algorithm: ALGORITHM,
        expiresIn: "24h",
        issuer: ISSUER,
        subject: subject
    });
};

const getValidToken = (token: string): ({[key: string]: string}) | undefined => {
    try {
        return jwt.verify(token, SECRET, {
            algorithms: [ALGORITHM],
            issuer: ISSUER
        }) as any;
    } catch (e) {
        return undefined;
    }
};

export const createAuthToken = (body: any | undefined) => {
    if (!body) {
        throw new Error();
    }
    const parameters = new URLSearchParams(body);
    if (!parameters.has("username") || !parameters.has("password")) {
        throw new Error();
    }

    // TODO
    return signToken("12345", {email: "test@example.com", name: "Test"});
};

const getCookies = (header: string | undefined): Map<string, string> => {
    const cookies: Map<string, string> = new Map();
    if (!header) {
        return cookies;
    }
    header.split(";").forEach(nameValue => {
        const [name, value] = nameValue.split("=");
        cookies.set(name, value || "");
    });
    return cookies;
};

export const withAuth = (handler: LambdaHandler<LambdaRequest & {user: User}>): LambdaHandler => {
    return async (event, context) => {
        const cookies = getCookies(event.headers.cookie);
        const rawToken = cookies.get("authorization") || event.headers.authorization;

        if (rawToken) {
            const token = getValidToken(rawToken);

            if (token) {
                return handler({...event, user: new User({name: token.name, email: token.email})}, context);
            }
        }
        return jsonResponse(
            {
                status: 401,
                message: "Credentials are required to access this resource."
            },
            401
        );
    };
};
