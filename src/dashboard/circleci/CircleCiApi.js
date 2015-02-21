import OAuth2Api from "./OAuth2Api";

export default class CircleCiApi extends OAuth2Api {
    constructor() {
        super();
    }

    getBaseUrl() {
        return "https://circleci.com/api/v1";
    }

    authenticateRequest(req) {
        req.query({"circle-token": this.token});
    }
}