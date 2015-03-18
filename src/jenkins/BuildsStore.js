import CachingStore from "../flux/CachingStore"
import request from "superagent";
import Build from "./Build";
import TestReport from "./TestReport";

export default class BuildsStore extends CachingStore {
    constructor() {
        super(__filename);

        this.state = this.getCachedState() || {
            builds: [],
            reports: {}
        };

        this.pendingReports = {};

        this._updateBuilds();

        setInterval(this._updateBuilds.bind(this), 30 * 1000);
    }

    onRecentBuildsChanged(listener) {
        return this._registerListener("builds", listener);
    }

    getRecentBuilds() {
        return this.state.builds;
    }

    onTestReportsChanged(listener) {
        return this._registerListener("reports", listener);
    }

    getTestReports() {
        return this.state.reports;
    }

    _updateBuilds() {
        request.get("/job/integration-test-generic-build/api/json")
            .query("tree=builds[id,building,result,timestamp,duration,actions[parameters[*],causes[userName,upstreamBuild,upstreamProject]]]{0,50}")
            .end((err, result) => {
                var builds = _.map(result.body.builds, (data) => {
                    return new Build(data);
                });

                _.forEach(builds, (build) => {
                    if (build.isUnstable()) {
                        this._updateTestReport(build.id);
                    }
                });

                this.setState({builds: builds});
            });
    }

    _updateTestReport(id) {
        if (this.state.reports[id] || this.pendingReports[id]) {
            return;
        }
        this.pendingReports[id] = true;

        request.get("/job/integration-test-generic-build/" + id + "/testReport/api/json")
            .query("tree=failCount,passCount,skipCount,suites[name,cases[name,status,stdout]]")
            .end((err, result) => {
                if (err) {
                    return;
                }
                var report = new TestReport(result.body);
                this.setState({reports: _.assign({[id]: report}, this.state.reports)});
            });
    }

    unmarshalState(data) {
        return {
            builds: data.builds ? _.map(data.builds, (build) => {
                return new Build(build);
            }) : [],
            reports: data.reports ? _.reduce(data.reports, (result, value, key) => {
                result[key] = new TestReport(value);
                return result;
            }, {}) : {}
        };
    }
}
