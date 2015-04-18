import _ from "lodash";
import moment from "moment";
import request from "superagent-bluebird-promise";
import CachingStore from "../../flux/CachingStore";
import Build from "../build/Build";
import TestReport from "../build/TestReport";
import FailureData from "../build/FailureData";

/**
 * Store for the data from a single Jenkins build job.
 */
export default class JobStore extends CachingStore {
    /**
     * @param {String} name The job name, as seen in the Jenkins url.
     * @param {Number} [limit=50] The number of builds to fetch.
     * @param {Boolean} [reports=true] Wheter to retrieve test and failure reports.
     */
    constructor(name, limit=50, reports=true) {
        super(__filename + name + "2");
        this.name = name;
        this.limit = limit;
        this.reports = reports;
        this.state = this.getCachedState() || {
            builds: {},
            reports: {},
            failureData: {}
        };
        this.pendingReports = {};
        this.pendingFailureData = {};

        window["clearReports_" + name.replace(/-/g, "_")] = () => {
            this.setState({reports: {}, failureData: {}});
        };

        this._updateBuilds();
        setInterval(this._updateBuilds.bind(this), 30 * 1000);
    }

    onBuildsChanged(listener) {
        return this._registerListener("builds", listener);
    }

    onBuildFinished(listener) {
        return this._registerListener("finished", listener);
    }

    getBuilds() {
        return _.values(this.state.builds).reverse();
    }

    getBuild(id) {
        return this.state.builds[id];
    }

    onTestReportsChanged(listener) {
        return this._registerListener("reports", listener);
    }

    getTestReports() {
        return this.state.reports;
    }

    onFailureDataChanged(listener) {
        return this._registerListener("failureData", listener);
    }

    getFailureData() {
        return this.state.failureData;
    }

    getFailedBuilds() {
        return _.filter(this.getBuilds(), (build) => {
            return build.isFailed() || build.isAborted();
        });
    }

    getUnstableBuilds() {
        return _.filter(this.getBuilds(), (build) => {
            return build.isUnstable();
        });
    }

    getSuccessfulBuilds() {
        return _.filter(this.getBuilds(), (build) => {
            return build.isSuccess();
        });
    }

    getLastNightBuilds() {
        return _.filter(this.getBuilds(), (build) => {
            var started = moment(build.timestamp);
            var thisMorning = moment().startOf("day").add(7, "hours");
            var yesterdayEvening = moment().startOf("day").subtract(6, "hours");

            return started.isAfter(yesterdayEvening) && started.isBefore(thisMorning);
        });
    }

    getUserBuilds(user) {
        if (!user) {
            return [];
        }
        return _.filter(this.getBuilds(), (build) => {
            return build.getUserId() === user.id;
        });
    }

    _updateBuilds() {
        request.get("/job/" + this.name + "/api/json")
            .query("tree=builds[number,building,result,timestamp,duration,url,keepLog,actions[parameters[*]," +
            "causes[userName,userId,upstreamBuild,upstreamProject],totalCount,urlName]]{0," + this.limit + "}")
            .then((result) => {
                var builds = {};
                var reports = {};
                var failureData = {};
                _.forEach(result.body.builds, (data) => {
                    var build = new Build(data);
                    var id = build.getId();
                    builds[id] = build;

                    if (this.state.reports[id]) {
                        reports[id] = this.state.reports[id];
                    }
                    if (this.state.failureData[id]) {
                        failureData[id] = this.state.failureData[id];
                    }
                });

                var oldBuilds = this.state.builds;
                this.setState({
                    builds: builds,
                    reports: reports,
                    failureData: failureData
                });

                _.forEach(builds, (build) => {
                    var id = build.getId();
                    if (this.reports) {
                        if (build.isUnstable() && build.hasTestReport()) {
                            this._updateTestReport(id);
                        } else if (build.isFailed()) {
                            this._updateFailureData(id);
                        }
                    }

                    var previous = oldBuilds[id];
                    if (previous && previous.isBuilding() && !build.isBuilding()) {
                        this._trigger("finished", id);
                    }
                });
            })
            .catch(() => {});
    }

    _updateTestReport(id) {
        if (this.state.reports[id] || this.pendingReports[id]) {
            return;
        }
        this.pendingReports[id] = true;

        request.get("/job/" + this.name + "/" + id + "/testReport/api/json")
            .query("tree=failCount,passCount,skipCount,suites[name,cases[name,status,stdout]]")
            .then((result) => {
                if (result.body && result.body.suites) {
                    var report = new TestReport(result.body);
                    this.setState({reports: _.assign({[id]: report}, this.state.reports)});
                }
            })
            .catch(() => {});
    }

    _updateFailureData(id) {
        if (this.state.failureData[id] || this.pendingFailureData[id]) {
            return;
        }
        this.pendingFailureData[id] = true;

        request.get("/job/" + this.name + "/" + id + "/consoleText")
            .then((result) => {
                var data = FailureData.fromConsoleOutput(result.text);
                this.setState({failureData: _.assign({[id]: data}, this.state.failureData)});
            })
            .catch(() => {});
    }

    unmarshalState(data) {
        return {
            builds: CachingStore.mapOf(data.builds, Build),
            reports: CachingStore.mapOf(data.reports, TestReport),
            failureData: CachingStore.mapOf(data.failureData, FailureData)
        };
    }
}
