import _ from "lodash";
import BuildLike from "./BuildLike";

/**
 * A build of a specific Jenkins job.
 */
export default class Build extends BuildLike {
    getId() {
        return this.number;
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
        var cause = this._getCauseWithProperty("upstreamBuild");
        if (cause) {
            return {
                id: cause.upstreamBuild,
                name: cause.upstreamProject
            }
        } else {
            return {};
        }
    }

    getJobName() {
        return /\/job\/(.+?)\/./.exec(this.url)[1];
    }
}
