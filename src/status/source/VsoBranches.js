import _ from "lodash";
import moment from "moment";
import Promise from "bluebird";
import VsoBase from "./VsoBase";

export default class VsoBranches extends VsoBase {
    constructor(data, util) {
        super(data, util);
        this.repoId = data.repoId;
    }

    fetchBranches() {
        return this.fetchGitData("/refs/heads")
            .promise()
            .then(response => _.map(response.body.value, value => value.name.substr(value.name.lastIndexOf("/") + 1)));
    }

    fetchPullRequests() {
        return this.fetchGitData("/pullrequests")
            .query({
                status: "Active",
                targetRefName: "refs/heads/master"
            })
            .promise()
            .then(response => response.body.value);
    }

    getStatus() {
        return Promise.all([this.fetchBranches(), this.fetchBuilds(), this.fetchPullRequests()])
            .catch(() => {
                return {
                    title: this.title,
                    link: this.getBaseUrl() + this.project + "/_build",
                    status: "danger",
                    messages: [{
                        message: "No response from API"
                    }]
                };
            })
            .spread((branches, builds, prs) => {
                return _.map(branches, branch => {
                    var status = this.createStatus(builds, branch);
                    status.title = branch;

                    var branchPr = _.find(prs, {sourceRefName: "refs/heads/" + branch});
                    if (branchPr) {
                        status.messages.push({
                            name: "Pull request: " + branchPr.title,
                            link: this.getBaseUrl() + "_git/" + this.project + "/pullrequest/" + branchPr.pullRequestId,
                            message: "Created by " + branchPr.createdBy.displayName + " " + moment(branchPr.creationDate).fromNow()
                        });
                    }

                    return status;
                });
            });
    }
}

VsoBranches.type = "vso-branches";
