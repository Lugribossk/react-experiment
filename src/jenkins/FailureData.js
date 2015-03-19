export default class FailureData {
    constructor(data) {
        if (_.isObject(data)) {
            _.assign(this, data);
            return;
        }

        var misspelledBranch = /fatal: Not a valid object name (\S+)/g.exec(data);
        if (misspelledBranch && misspelledBranch[1]) {
            this.misspelledBranch = misspelledBranch[1];
        }

        var noFastForward = /cannot fast-forward master to (\S+)/g.exec(data);
        if (noFastForward && noFastForward[1]) {
            this.noFastForward = noFastForward[1];
        }

        var notBuilt = /^(\S+) for git reference .+? needs to be built/g.exec(data);
        if (notBuilt && notBuilt[1]) {
            this.notBuilt = notBuilt[1];
        }
    }
}
