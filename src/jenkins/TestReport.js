import _ from "lodash";

export default class TestReport {
    constructor(data) {
        _.assign(this, data);
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