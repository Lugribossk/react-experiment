import _ from "lodash";

var ESTIMATED_DURATION_MINS = 30;

export default {
    estimatePercentComplete(build, now, builds) {
        if (!build.isBuilding()) {
            return 100;
        }
        var estimatedDuration = this.getEstimatedDurationMs(build, builds);
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.min(Math.round(runningFor / estimatedDuration * 100), 100);
    },

    estimateMinutesRemaining(build, now, builds) {
        if (!build.isBuilding()) {
            return 0;
        }
        var estimatedDuration = this.getEstimatedDurationMs(build, builds);
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.ceil((estimatedDuration - runningFor) / 60000);
    },

    getEstimatedDurationMs(runningBuild, builds) {
        if (!builds) {
            return ESTIMATED_DURATION_MINS * 60 * 1000;
        }

        var finishedBuilds = _.filter(builds, (build) => {
            return build.isSuccess() || build.isUnstable();
        });
        var samePackageBuilds = _.filter(finishedBuilds, (build) => {
            return build.getParameters().PACKAGE_PATH === runningBuild.getParameters().PACKAGE_PATH;
        });

        if (samePackageBuilds.length === 0 && runningBuild.getParameters().PACKAGE_PATH !== "com/tradeshift") {
            samePackageBuilds = finishedBuilds;
        }
        if (samePackageBuilds.length === 0) {
            return ESTIMATED_DURATION_MINS * 60 * 1000;
        }

        var durationSum = _.reduce(samePackageBuilds, (result, build) => {
            return result + build.duration;
        }, 0);
        return Math.ceil(durationSum / samePackageBuilds.length);
    }
}