import _ from "lodash";

export default class TestReport {
    constructor(data) {
        _.assign(this, data);

        _.forEach(this.suites, (suite) => {
            _.forEach(suite.cases, (kase) => {
                if (kase.stdout && kase.status !== "PASSED" && kase.status !== "SKIPPED" && kase.status !== "FIXED") {
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

    getFailingTests() {
        var tests = [];
        _.forEach(this.suites, (suite) => {
            _.forEach(suite.cases, (kase) => {
                if (kase.status !== "PASSED" && kase.status !== "SKIPPED" && kase.status !== "FIXED") {
                    tests.push({
                        file: suite.name,
                        name: kase.name
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
}