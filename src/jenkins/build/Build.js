import _ from "lodash";
import JenkinsUtils from "../JenkinsUtils";

/**
 * A build of a specific Jenkins job.
 */
export default class Build {
    constructor(data) {
        _.assign(this, data);
    }

    isBuilding() {
        return this.building;
    }

    isSuccess() {
        return this.result === "SUCCESS";
    }

    isUnstable() {
        return this.result === "UNSTABLE";
    }

    isFailed() {
        return this.result === "FAILED" || this.result === "FAILURE";
    }

    isAborted() {
        return this.result === "ABORTED";
    }

    getUpstream() {
        var cause = JenkinsUtils.getCauseWithProperty(this.actions, "upstreamBuild");
        if (cause) {
            return {
                id: cause.upstreamBuild,
                name: cause.upstreamProject
            }
        } else {
            return {};
        }
    }

    getUserFullName() {
        var cause = JenkinsUtils.getCauseWithProperty(this.actions, "userName");
        if (cause) {
            return cause.userName;
        } else {
            return null;
        }
    }

    getUserId() {
        var cause = JenkinsUtils.getCauseWithProperty(this.actions, "userId");
        if (cause) {
            return cause.userId;
        } else {
            return null;
        }
    }

    getJobName() {
        return /\/job\/(.+?)\/./.exec(this.url)[1];
    }

    getParameters() {
        return JenkinsUtils.getParameters(this.actions);
    }
}
