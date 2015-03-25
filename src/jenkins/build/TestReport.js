import _ from "lodash";

/**
 * The test output from a build.
 */
export default class TestReport {
    constructor(data) {
        _.assign(this, data);

        _.forEach(this.suites, (suite) => {
            _.forEach(suite.cases, (kase) => {
                if (kase.stdout && TestReport._isFailedCase(kase)) {
                    var slave = /Ran on slave +: (\S+)/.exec(kase.stdout);
                    if (slave) {
                        kase.slave = slave[1];
                    }
                    var subset = /As build number +: (\S+)/.exec(kase.stdout);
                    if (subset) {
                        kase.subset = subset[1];
                    }
                }
                delete kase.stdout;
            });
        });
    }

    getFailedTests() {
        var tests = [];
        _.forEach(this.suites, (suite) => {
            _.forEach(suite.cases, (kase) => {
                if (TestReport._isFailedCase(kase)) {
                    tests.push({
                        file: suite.name,
                        name: kase.name,
                        slave: kase.slave
                    });
                }
            });
        });

        // Sometimes the same test shows up twice...
        tests = _.uniq(tests, (test) => {
            return test.file + test.name;
        });

        return tests;
    }

    hasFailedTest(klass, method) {
        return _.some(this.getFailedTests(), (failedTest) => {
            return failedTest.file === klass && failedTest.name === method;
        });
    }

    static _isFailedCase(kase) {
        return kase.status !== "PASSED" && kase.status !== "SKIPPED" && kase.status !== "FIXED";
    }
}
