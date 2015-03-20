import React from "react";
import _ from "lodash";
import moment from "moment";
import {Panel, ProgressBar, ModalTrigger, Button, Alert, Glyphicon} from "react-bootstrap"
import FailedBuild from "./status/FailedBuild";
import InProgressBuild from "./status/InProgressBuild";
import SuccessfulBuild from "./status/SuccessfulBuild";
import UnstableBuild from "./status/UnstableBuild";

export default class BuildStatus extends React.Component {
    getBuildTime() {
        if (this.props.build.isBuilding()) {
            return;
        }
        var time = moment(this.props.build.timestamp + this.props.build.duration);
        if (time.isBefore(moment().startOf("week"))) {
            return time.format("ddd Do MMM HH:mm")
        } else if (time.isBefore(moment().startOf("day"))) {
            return time.format("ddd HH:mm");
        } else {
            return time.format("HH:mm");
        }
    }

    getStyle() {
        if (this.props.build.isBuilding()) {
            return "info";
        } else if (this.props.build.isSuccess()) {
            return "success"
        } else if (this.props.build.isUnstable()) {
            return "warning"
        } else {
            return "danger";
        }
    }

    renderHeader() {
        return (
            <span>
                <a href={"/job/integration-test-generic-build/" + this.props.build.number} target="_blank">
                    {"#" + this.props.build.number} - {this.props.build.getUserFullName() || "Unknown"}
                </a>
                <span style={{float: "right"}}>
                    {this.props.build.keepLog &&
                        <Glyphicon glyph="lock" title="Kept forever"/>}
                    {this.getBuildTime()}
                </span>
            </span>
        );
    }

    renderBranches() {
        var branches = _.map(this.props.build.getRepoBranches(), (branch, repo) => {
            if (branch && branch !== "master") {
                return (
                    <div key={repo}>
                        <a href={"https://github.com/Tradeshift/" + repo + "/tree/" + branch} target="_blank">
                            {repo}: {branch}
                        </a>
                    </div>
                );
            }
        });
        return (
            <div>
                {this.props.build.getParameters().BRANCH !== "master" &&
                    <span>All repos: {this.props.build.getParameters().BRANCH}</span>}
                {branches}
                {this.props.build.getParameters().PACKAGE_PATH !== "com/tradeshift" &&
                    <span>Only running tests in package: {this.props.build.getParameters().PACKAGE_PATH}</span>}
            </div>
        )
    }

    renderStatus() {
        if (this.props.build.isBuilding()) {
            return <InProgressBuild {...this.props}>{this.renderBranches()}</InProgressBuild>;
        } else if (this.props.build.isSuccess()) {
            return <SuccessfulBuild {...this.props}>{this.renderBranches()}</SuccessfulBuild>;
        } else if (this.props.build.isUnstable()) {
            return <UnstableBuild {...this.props}>{this.renderBranches()}</UnstableBuild>;
        } else {
            return <FailedBuild {...this.props}>{this.renderBranches()}</FailedBuild>;
        }
    }

    render() {
        return (
            <Panel bsStyle={this.getStyle()} header={this.renderHeader()}>
                {this.renderStatus()}
            </Panel>
        );
    }
}
