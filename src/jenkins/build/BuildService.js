import request from "superagent-bluebird-promise";
import BuildActions from "./BuildActions";

export default class BuildService {
    constructor() {
        BuildActions.abort.onDispatch(this.abort.bind(this));
    }

    abort(build) {
        request.post(build.url + "stop").end();
    }
}