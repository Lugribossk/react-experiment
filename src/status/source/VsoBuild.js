import _ from "lodash";
import moment from "moment";
import request from "superagent-bluebird-promise";
import Source from "./Source";

export default class VsoBuild extends Source {
    constructor(data, util) {
        super(data);
        this.account = data.account;
        this.project = data.project;
        this.username = data.username;
        this.password = util.decrypt(data.password);
        this.branch = data.branch || "master";
    }

    getRequest() {
        return request.get("https://" + this.account + ".visualstudio.com/DefaultCollection/" + this.project + "/_apis/build/builds")
            .auth(this.username, this.password)
            .promise()
            .catch(e => e);
    }

    getStatus() {
        return this.getRequest().then(response => {
            var link;
            var status;
            var message;
            var progress;

            if (!response || !response.body) {
                status = "danger";
                message = "No response from API";
                link = "https://" + this.account + ".visualstudio.com/DefaultCollection/" + this.project + "/_build";
            } else {
                var builds = response.body.value;
                var branchBuilds = _.filter(builds, {sourceBranch: "refs/heads/" + this.branch});

                if (branchBuilds.length === 0) {
                    status = "warning";
                    message = "No builds found for branch '" + this.branch + "'";
                } else {
                    var build = branchBuilds[0];
                    link = build._links.web.href;

                    var finishTime = moment(build.finishTime).fromNow();
                    if (build.status !== "completed") {
                        status = "info";
                        message = "Build in progress";

                        progress = {
                            percent: now => this.getEstimatedPercentComplete(now, build, builds),
                            remaining: now => this.getEstimatedTimeRemaining(now, build, builds)
                        };
                    } else {
                        if (build.result === "partiallySucceeded") {
                            status = "warning";
                            message = "Partially succeeded " + finishTime;
                        } else if (build.result === "succeeded") {
                            status = "success";
                            message = "Built " + finishTime;
                        } else if (build.result === "canceled") {
                            status = "danger";
                            message = "Canceled " + finishTime;
                        } else {
                            status = "danger";
                            message = "Failed " + finishTime;
                        }
                    }
                }
            }

            return {
                title: this.title,
                link: link,
                status: status,
                messages: [{
                    message: message
                }],
                progress: progress
            };
        });
    }

    getEstimatedTimeRemaining(now, build, builds) {
        var average = this.getAverageBuildDuration(builds);
        if (!average) {
            return null;
        }

        return average.subtract(now.diff(moment(build.startTime)));
    }

    getEstimatedPercentComplete(now, build, builds) {
        var average = this.getAverageBuildDuration(builds);
        if (!average) {
            return 0;
        }

        var start = moment(build.startTime);
        var timeSpent = moment.duration(now.diff(start));
        return Math.min(Math.ceil(timeSpent.asSeconds() / average.asSeconds() * 100), 100);
    }

    getAverageBuildDuration(builds) {
        // If there are any builds with the target branch then only use those.
        var branchBuilds = _.filter(builds, {sourceBranch: "refs/heads/" + this.branch});
        if (branchBuilds.length === 0) {
            branchBuilds = builds;
        }

        var count = 0;
        var sum = 0;
        _.forEach(branchBuilds, build => {
            var duration = this.getBuildDuration(build);
            if (duration && duration.asSeconds() > 5) {
                count++;
                sum += duration.asSeconds();
            }
        });

        if (count === 0) {
            return null;
        } else {
            return moment.duration(Math.round(sum / count), "seconds");
        }
    }

    getBuildDuration(build) {
        if (!build.startTime || !build.finishTime) {
            return null;
        }

        var start = moment(build.startTime);
        var finish = moment(build.finishTime);
        return moment.duration(finish.diff(start));
    }
}

VsoBuild.type = "vso-build";