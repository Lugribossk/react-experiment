import React from "react";
import _ from "lodash";
import GithubLink from "./GithubLink";
import BuildUtils from "../build/BuildUtils";

export default class ParameterDetails extends React.Component {
    renderAllBranch() {
        var onlyMaster = true;
        _.each(BuildUtils.getRepoBranches(this.props.parameters), (branch) => {
            if (branch && branch !== "master") {
                onlyMaster = false;
            }
        });

        if (this.props.parameters.BRANCH !== "master" || onlyMaster) {
            return <span>All repos: {this.props.parameters.BRANCH}</span>;
        }
    }

    renderBranches() {
        return _.map(BuildUtils.getRepoBranches(this.props.parameters), (branch, repo) => {
            var nonMasterBranch = (branch && branch !== "master");
            var itForNonMasterAll = (repo === "Integration-Test" && this.props.parameters.BRANCH !== "master");
            if (nonMasterBranch || itForNonMasterAll) {
                return <GithubLink key={repo} owner="Tradeshift" repo={repo} branch={branch} />;
            }
        });
    }

    renderPackage() {
        if (this.props.parameters.PACKAGE_PATH !== "com/tradeshift") {
            return <span>Only running tests in package: {this.props.parameters.PACKAGE_PATH}</span>;
        }
    }

    render() {
        return (
            <div>
                {this.renderAllBranch()}
                {this.renderBranches()}
                {this.renderPackage()}
            </div>
        );
    }
}
