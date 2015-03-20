import _ from "lodash";
import Piecon from "piecon";
import BuildUtils from "./build/BuildUtils";

export default class NotificationService {
    constructor(jobStore, userId) {
        this.jobStore = jobStore;
        this.userId = userId;

        jobStore.onBuildsChanged(this.notifyProgress.bind(this));
        setInterval(this.notifyProgress.bind(this), 5000);
        this.notifyProgress();
    }

    notifyProgress() {
        var build = this.getMostInterestingBuild();
        if (!build) {
            return;
        }

        Piecon.setProgress(BuildUtils.estimatePercentComplete(build, Date.now()));

        if (build.isBuilding()) {
            this.setFaviconColor("#5bc0de");
            document.title = BuildUtils.estimateMinutesRemaining(build, Date.now()) + "m - ITs";
        } else {
            if (build.isSuccess()) {
                this.setFaviconColor("#5cb85c");
            } else if (build.isUnstable()) {
                this.setFaviconColor("#f0ad4e");
            } else {
                this.setFaviconColor("#d9534f");
            }
            document.title = "ITs";
        }
    }

    setFaviconColor(color) {
        Piecon.setOptions({
            color: color,
            background: "#ffffff"
        });
    }

    getMostInterestingBuild() {
        var builds = this.jobStore.getBuilds();
        var runningBuilds = _.filter(builds, (build) => {
            return build.isBuilding();
        });

        if (runningBuilds.length > 1) {
            var userBuilds = _.filter(runningBuilds, (build) => {
                return build.getUserId() === this.userId;
            });

            if (userBuilds.length > 0) {
                return userBuilds[0];
            } else {
                return runningBuilds[0];
            }
        } else if (runningBuilds.length === 1) {
            return runningBuilds[0];
        } else if (builds.length > 0) {
            return builds[0];
        } else {
            return null;
        }
    }
}