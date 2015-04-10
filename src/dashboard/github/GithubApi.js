import SuperagentApi from "../../util/SuperagentApi";

// https://developer.github.com/v3/auth/#basic-authentication

export default class GithubApi extends SuperagentApi {
    _getBaseUrl() {
        return "https://api.github.com";
    }

    _authenticateRequest(req) {
        req.set("Authorization", "Bearer " + this.token + ":x-oauth-basic");
    }
}