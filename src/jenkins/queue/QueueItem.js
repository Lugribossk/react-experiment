import _ from "lodash";
import JenkinsUtils from "../JenkinsUtils";

export default class QueueItem {
    constructor(data) {
        _.assign(this, data);
    }

    getJobName() {
        return this.task.name;
    }

    getUserFullName() {
        var cause = JenkinsUtils.getCauseWithProperty(this.actions, "userName");
        if (cause) {
            return cause.userName;
        } else {
            return null;
        }
    }

    getParameters() {
        return JenkinsUtils.getParameters(this.actions);
    }
}