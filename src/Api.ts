import User from "./auth/User";

export default class Api {
    private readonly baseUrl: string;
    private accessToken: string | undefined;

    constructor() {
        // TODO
        this.baseUrl =
            window.location.host === "localhost" ? "http://localhost:9090/.netlify/functions" : "/.netlify/functions";
        this.accessToken = undefined;
    }

    private async sendRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
        const init: RequestInit = {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            ...options,
            headers: {
                ...options.headers
            }
        };
        if (this.accessToken) {
            (init.headers as any).Authorization = `Bearer ${this.accessToken}`;
        }
        const response = await fetch(`${this.baseUrl}/${endpoint}`, init);

        if (!response.ok) {
            throw new Error("Request failed");
        }

        return response.json();
    }

    async login(username: string, password: string): Promise<string> {
        const params = new URLSearchParams();
        params.set("username", username);
        params.set("password", password);
        params.set("grant_type", "password");

        const data = await this.sendRequest("token", {
            method: "POST",
            body: params as any
        });

        // TODO
        this.accessToken = data.accessToken;

        return data.accessToken;
    }

    async logout(): Promise<void> {
        this.accessToken = undefined;
    }

    async getCurrentUser(): Promise<User | undefined> {
        try {
            const data = await this.sendRequest("user");
            return new User(data);
        } catch (error) {
            return undefined;
        }
    }
}
