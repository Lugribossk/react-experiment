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
        var missingBranch = /fatal: Not a valid object name (\S+)/g.exec(text);
        if (missingBranch && missingBranch[1]) {
            data.missingBranch = missingBranch[1];
        }
        var missingBranch2 = /SHORT_HASH=\n(?:\w|\W)+?checking merge validity for (.+?)\/origin\/(.+?) /g.exec(text);
        if (missingBranch2 && missingBranch2[1]) {
            data.missingBranch = missingBranch2[2];
            data.missingBranchRepo = missingBranch2[1];
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
