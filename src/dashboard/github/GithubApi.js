import OAuth2Api from "../../util/OAuth2Api";

// https://developer.github.com/v3/auth/#basic-authentication

export default class GithubApi extends OAuth2Api {
    constructor() {
        super();
    }

    getBaseUrl() {
        return "https://api.github.com";
    }

    authenticateRequest(req) {
        req.set("Authorization", "Bearer " + this.token + ":x-oauth-basic");
    }
}