import request from "superagent-bluebird-promise";
import moment from "moment";
import JobActions from "./JobActions";
import BuildUtils from "../build/BuildUtils";

export default class JobService {
    constructor() {
        JobActions.triggerBuild.onDispatch(this.triggerBuild.bind(this));
        JobActions.triggerPullRequest.onDispatch(this.triggerPullRequest.bind(this));
        JobActions.triggerIntegrationTest.onDispatch(this.triggerIntegrationTest.bind(this));
        JobActions.unkeepBuilds.onDispatch(this.unkeepBuilds.bind(this));
    }

    triggerBuild(jobName, parameters) {
        var paramList = _.map(parameters, (value, name) => {
            return {name: name, value: value};
        });

        request.post("/job/" + jobName + "/build") //buildWithParameters?
            .type("form")
            .send({json: JSON.stringify({parameter: paramList})})
            .end();
    }

    triggerPullRequest(repoBranches, changelog) {
        var params = {
            CHANGELOG: changelog,
            CHANGELEVEL: "Level 1: (least impact) Functional defect resolution; some performance improvements",
            AUTO_TEST_COVERAGE: false,
            CROSS_BROWSER_TESTED: false
        };

        _.forEach(BuildUtils.PR_PARAM_REPOS, (repo, param) => {
            var branch = repoBranches[repo];
            params[param] = "origin/" + (branch || "master");
        });

        this.triggerBuild("pull-request", params);
    }

    triggerIntegrationTest(repoBranches, changelog, packagePath) {
        var params = {
            FORCE_BUILD: false,
            REQUIRE_FAST_FORWARD: true,
            PACKAGE_PATH: packagePath || "com/tradeshift",
            BRANCH: "master",
            COPY_ONLY_ARTIFACTS_OF_FAILED_TESTS: true,
            GEB_ENV: "default",
            CHINAPAYMENT_GIT_REF: "origin/master",
            CHANGELOG: changelog
        };

        _.forEach(BuildUtils.IT_PARAM_REPOS, (repo, param) => {
            var branch = repoBranches[repo];
            params[param] = "origin/" + (branch || "master");
        });

        this.triggerBuild("integration-test-generic-build", params);
    }

    unkeepBuilds(jobName, olderThan) {
        request.get("/job/" + jobName + "/api/json")
            .query("tree=builds[number,timestamp,keepLog]{0,100}")
            .then((data) => {
                _.forEach(data.body.builds, (build) => {
                    if (build.keepLog && build.timestamp && moment(build.timestamp, "x").isBefore(olderThan)) {
                        request.get(build.url + "toggleLogKeep")
                            .query("json={}")
                            .end();
                    }
                });
            });
    }
}