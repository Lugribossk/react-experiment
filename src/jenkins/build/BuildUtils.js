var ESTIMATED_DURATION_MINS = 30;

export default {
    estimatePercentComplete(build, now) {
        if (!build.isBuilding()) {
            return 100;
        }
        var estimatedDuration = ESTIMATED_DURATION_MINS * 60 * 1000;
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.min(Math.round(runningFor / estimatedDuration * 100), 100);
    },

    estimateMinutesRemaining(build, now) {
        if (!build.isBuilding()) {
            return 0;
        }
        var estimatedDuration = ESTIMATED_DURATION_MINS * 60 * 1000;
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.ceil((estimatedDuration - runningFor) / 60000);
    }
}