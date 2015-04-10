import SuperagentApi from "../../util/SuperagentApi";

export default class CircleCiApi extends SuperagentApi {
    _getBaseUrl() {
        return "https://circleci.com/api/v1";
    }

    _authenticateRequest(req) {
        req.query({"circle-token": this.token});
    }
}