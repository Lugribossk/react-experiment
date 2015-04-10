import React from "react";
import _ from "lodash";
import moment from "moment";
import {Panel, ProgressBar, ModalTrigger, Button, Alert, Glyphicon} from "react-bootstrap"
import FailedBuild from "./status/FailedBuild";
import InProgressBuild from "./status/InProgressBuild";
import SuccessfulBuild from "./status/SuccessfulBuild";
import UnstableBuild from "./status/UnstableBuild";
import ParameterDetails from "../ui/ParameterDetails";

export default class BuildStatus extends React.Component {
    renderBuildTime() {
        if (this.props.build.isBuilding()) {
            return null;
        }
        var time = moment(this.props.build.timestamp + this.props.build.duration);
        if (time.isBefore(moment().startOf("week"))) {
            return time.format("ddd Do MMM HH:mm");
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
            return "success";
        } else if (this.props.build.isUnstable()) {
            return "warning";
        } else {
            return "danger";
        }
    }

    renderHeader() {
        return (
            <span>
                <a href={this.props.build.url} target="_blank">
                    {"#" + this.props.build.getId()} - {this.props.build.getUserFullName() || "Unknown"}
                </a>
                <span style={{float: "right"}}>
                    {this.props.build.keepLog &&
                        <Glyphicon glyph="lock" title="Kept forever"/>}
                    {this.renderBuildTime()}
                </span>
            </span>
        );
    }

    renderStatus() {
        if (this.props.build.isBuilding()) {
            return <InProgressBuild {...this.props} />;
        } else if (this.props.build.isSuccess()) {
            return <SuccessfulBuild {...this.props} />;
        } else if (this.props.build.isUnstable()) {
            return <UnstableBuild {...this.props} />;
        } else {
            return <FailedBuild {...this.props} />;
        }
    }

    render() {
        return (
            <Panel bsStyle={this.getStyle()} style={{overflow: "hidden"}} header={this.renderHeader()}>
                {this.renderStatus()}
            </Panel>
        );
    }
}
