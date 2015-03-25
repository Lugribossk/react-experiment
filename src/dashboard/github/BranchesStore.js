import Promise from "bluebird";
import Store from "../../flux/Store";
import GitRef from "./GitRef";

export default class BranchesStore extends Store {
    constructor(repo, api) {
        super();
        this.repo = repo;
        this.api = api;

        this.state = {
            branches: []
        };

        this._fetchBranches();
    }

    _fetchBranches() {
        this.api.get("/" + this.repo + "/git/refs/heads")
            .as(GitRef)
            .then((branches) => {
                var withLastCommit = _.map(branches, (branch) => {
                    return this.api.getAs(branch.object.url, Commit)
                        .then((commit) => {
                            branch.lastCommit = commit;
                        });
                });
                return Promise.all(withLastCommit);
            })
            .then((branches) => {
                this.setState({branches: branches});
            });
    }

    onBranchesChange(listener) {
        return this._registerListener("branches", listener);
    }

    getBranches() {
        return this.state.branches;
    }
}