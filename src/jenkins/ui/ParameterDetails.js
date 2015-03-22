import React from "react";
import _ from "lodash";
import GithubLink from "./GithubLink";
import BuildUtils from "../build/BuildUtils";

export default class ParameterDetails extends React.Component {
    renderBranches() {
        return _.map(BuildUtils.getRepoBranches(this.props.parameters), (branch, repo) => {
            if (branch && branch !== "master") {
                return <GithubLink key={repo} owner="Tradeshift" repo={repo} branch={branch} />;
            }
        });
    }

    render() {
        return (
            <div>
                {this.props.parameters.BRANCH !== "master" &&
                <span>All repos: {this.props.parameters.BRANCH}</span>}
                {this.renderBranches()}
                {this.props.parameters.PACKAGE_PATH !== "com/tradeshift" &&
                <span>Only running tests in package: {this.props.parameters.PACKAGE_PATH}</span>}
            </div>
        )
    }
}