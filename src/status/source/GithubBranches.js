import React from "react";
import _ from "lodash";
import moment from "moment";
import Promise from "bluebird";
import request from "superagent-bluebird-promise";
import Source from "./Source";

var shortName = ref => ref.substr("refs/heads/".length);

export default class GithubBranches extends Source {
    constructor(data, util) {
        super(data);
        this.owner = data.owner;
        this.repo = data.repo;
        this.token = util.decrypt(data.token);
        this.showStatus = data.showStatus;
    }

    fetchData(path) {
        return request("https://api.github.com/repos/" + this.owner + "/" + this.repo + path)
            .set("Authorization", "token " + this.token);
    }

    fetchBranches() {
        return this.fetchData("/git/refs/heads")
            .promise()
            .then(response => response.body);
    }

    fetchPullRequests() {
        return this.fetchData("/pulls")
            .query("state", "open")
            .query("base", "master")
            .promise()
            .then(response => response.body);
    }

    fetchStatus(ref) {
        return this.fetchData("/commits/" + ref + "/status")
            .promise()
            .then(response => response.body);
    }

    createStatus(branch) {
        var status = {
            title: shortName(branch.ref),
            link: branch.url,
            status: "info",
            messages: []
        };

        if (!this.showStatus) {
            return Promise.resolve(status);
        }

        return this.fetchStatus(branch.ref)
            .then(githubStatus => {
                if (githubStatus.state === "success") {
                    status.status = "success";
                } else if (githubStatus === "pending") {
                    status.status = "info";
                } else {
                    status.status = "danger";
                }

                _.forEach(githubStatus.statuses, context => {
                    status.messages.push({
                        name: context.context,
                        message: context.description
                    });
                });

                return status;
            });
    }

    getStatus() {
        return Promise.all([this.fetchBranches(), this.fetchPullRequests()])
            .spread((branches, prs) => {
                return Promise.all(_.map(branches, branch => {
                    return this.createStatus(branch)
                        .then(status => {
                            var name = shortName(branch.ref);
                            var branchPr = _.find(prs, pr => pr.base.ref === name);
                            if (branchPr) {
                                var link = branch.html_url;
                                status.messages.push({
                                    name: <a href={link} target="_blank">Pull request: {branchPr.title}</a>,
                                    message: "Created by " + branchPr.user.login + " " + moment(branchPr.created_at).fromNow()
                                });
                            }

                            return status;
                        });
                }));
            })
            .catch(() => {
                return {
                    title: this.title,
                    link: "https://github.com/" + this.owner + "/" + this.repo,
                    status: "danger",
                    messages: [{
                        message: "Unable to determine status"
                    }]
                };
            });
    }
}

GithubBranches.type = "github-branches";
