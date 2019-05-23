import User from "./auth/User";

export default class Api {
    private readonly baseUrl: string;

    constructor() {
        // TODO
        this.baseUrl =
            window.location.host === "localhost" ? "http://localhost:9090/.netlify/functions" : "/.netlify/functions";
    }

    private async sendRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
        const init: RequestInit = {
            method: "GET",
            mode: "cors",
            credentials: "include",
            ...options,
            headers: {
                ...options.headers
            }
        };
        const response = await fetch(`${this.baseUrl}/${endpoint}`, init);

        if (!response.ok) {
            throw new Error("Request failed");
        }

        return response.json();
    }

    async login(username: string, password: string): Promise<void> {
        const data = await this.sendRequest("token", {
            method: "POST",
            body: new URLSearchParams(`username=${username}&password=${password}&grant_type=password`)
        });

        return Promise.resolve();
    }

    async logout(): Promise<void> {
        // TODO
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
