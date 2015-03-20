import _ from "lodash";

/**
 * Data on why a build might have failed.
 */
export default class FailureData {
    constructor(data) {
        _.assign(this, data);
    }

    static fromConsoleOutput(text) {
        var data = {};
        var misspelledBranch = /fatal: Not a valid object name (\S+)/g.exec(text);
        if (misspelledBranch && misspelledBranch[1]) {
            data.misspelledBranch = misspelledBranch[1];
        }

        var noFastForward = /cannot fast-forward master to (\S+)/g.exec(text);
        if (noFastForward && noFastForward[1]) {
            data.noFastForward = noFastForward[1];
        }

        var notBuilt = /'(\S+) for git reference .+? needs to be built/g.exec(text);
        if (notBuilt && notBuilt[1]) {
            data.notBuilt = notBuilt[1];
        }

        return new FailureData(data);
    }
}
