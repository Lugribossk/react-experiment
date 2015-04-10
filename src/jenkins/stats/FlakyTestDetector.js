import _ from "lodash";
import BuildUtils from "../build/BuildUtils";

export default class FlakyTestDetector {
    constructor(jobStore) {
        this.testReports = jobStore.getTestReports();
        this.successBuilds = jobStore.getSuccessfulBuilds();
        this.unstableBuilds = _.filter(jobStore.getUnstableBuilds(), (build) => {
            return this.testReports[build.getId()];
        });
    }

    getTestReport(build) {
        return this.testReports[build.getId()];
    }

    findInconsistentlyUnstableTestsForSameBranches() {
        var flaky = [];

        _.forEach(this.unstableBuilds.concat(this.successBuilds), (build) => {
            var sameBranchBuilds = FlakyTestDetector.getBuildsWithSameBranches(build, this.unstableBuilds);

            _.forEach(sameBranchBuilds, (otherBuild) => {
                var tests = FlakyTestDetector.getTestsThatOnlyFailInOne(this.getTestReport(build), this.getTestReport(otherBuild));

                flaky = flaky.concat(tests);
            });
        });

        return flaky;
    }

    static getBuildsWithSameBranches(build, buildList) {
        var branches = BuildUtils.getRepoBranches(build.getParameters());

        return _.filter(buildList, (otherBuild) => {
            var otherBranches = BuildUtils.getRepoBranches(otherBuild.getParameters());

            if (build !== otherBuild && _.keys(otherBranches).length === _.keys(branches).length) {
                return _.every(otherBranches, (branch, repo) => {
                    return branches[repo] === branch;
                });
            }
            return false;
        });
    }

    static getTestsThatOnlyFailInOne(report1, report2) {
        var tests1 = report1 ? report1.getFailedTests() : [];
        var tests2 = report2.getFailedTests();

        var ownOnlyFailures = _.filter(tests1, (test) => {
            return !report2.hasFailedTest(test.file, test.name);
        });
        var otherOnlyFailures = _.filter(tests2, (otherTest) => {
            var hasFailed = report1 ? report1.hasFailedTest(otherTest.file, otherTest.name) : false;
            return !hasFailed;
        });

        return ownOnlyFailures.concat(otherOnlyFailures);
    }
}
