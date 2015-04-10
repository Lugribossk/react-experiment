import _ from "lodash";
import Piecon from "piecon";
import BuildUtils from "./build/BuildUtils";

/**
 * Show notifications of build progress in the favicon and title.
 */
export default class NotificationService {
    constructor(jobStore, userId) {
        this.jobStore = jobStore;
        this.userId = userId;

        jobStore.onBuildsChanged(this.notifyProgress.bind(this));
        jobStore.onBuildFinished(this.notifyBuildFinished.bind(this));
        setInterval(this.notifyProgress.bind(this), 10000);
        this.notifyProgress();
    }

    notifyProgress() {
        var build = this.getMostInterestingBuild();
        if (!build) {
            return;
        }

        Piecon.setProgress(BuildUtils.estimatePercentComplete(build, Date.now(), this.jobStore.getBuilds()));

        if (build.isBuilding()) {
            NotificationService.setFaviconColor("#5bc0de");
            document.title = BuildUtils.estimateMinutesRemaining(build, Date.now(), this.jobStore.getBuilds()) + "m - ITs";
        } else {
            if (build.isSuccess()) {
                NotificationService.setFaviconColor("#5cb85c");
            } else if (build.isUnstable()) {
                NotificationService.setFaviconColor("#f0ad4e");
            } else {
                NotificationService.setFaviconColor("#d9534f");
            }
            document.title = "ITs";
        }
    }

    notifyBuildFinished(id) {
        if (Notification.permission !== "granted") {
            return;
        }

        var build = this.jobStore.getBuild(id);
        if (build.getUserId() === this.userId) {
            if (build.isSuccess()) {
                new Notification("Build succesful!", {
                    icon: "/static/19bcd89f/images/32x32/blue.png"
                });
            } else if (build.isUnstable()) {
                new Notification("Build unstable", {
                    icon: "/static/19bcd89f/images/32x32/yellow.png"
                });
            } else {
                new Notification("Build failed", {
                    icon: "/static/19bcd89f/images/32x32/red.png"
                });
            }
        }
    }

    /**
     * Get the newest running build triggered by the current user, or the newest running build, or the newest build.
     * @returns {Build}
     */
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

    static setFaviconColor(color) {
        Piecon.setOptions({
            color: color,
            background: "#ffffff"
        });
    }
}
