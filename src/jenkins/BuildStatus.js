import React from "react";
import _ from "lodash";
import moment from "moment";
import {Panel, ProgressBar, ModalTrigger, Button} from "react-bootstrap"
import Merge from "./Merge";

export default class BuildStatus extends React.Component {
    getLink() {
        return "/job/integration-test-generic-build/" + this.props.build.id;
    }

    renderHeader() {
        var displaytime = "";
        if (!this.props.build.building) {
            var time = moment(this.props.build.timestamp + this.props.build.duration);
            if (time.isBefore(moment().startOf("week"))) {
                displaytime = time.format("ddd Do MMM HH:mm")
            } else if (time.isBefore(moment().startOf("day"))) {
                displaytime = time.format("ddd HH:mm");
            } else {
                displaytime = time.format("HH:mm");
            }
        }

        return (
            <span>
                <a href={this.getLink()} target="_blank">{"#" + this.props.build.id} - {this.props.build.getUsername()}</a>
                <span style={{float: "right"}}>{displaytime}</span>
            </span>
        );
    }

    renderBranches() {
        return _.map(this.props.build.getRepoBranches(), (branch, repo) => {
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
    }

    renderProgress() {
        if (this.props.build.building) {
            var estimatedDuration = 45 * 60 * 1000;
            var started = this.props.build.timestamp;
            var runningFor = this.props.now - started;
            var progress = Math.round(runningFor / estimatedDuration * 100);

            var remainingMins = Math.ceil((estimatedDuration - runningFor) / 60000);

            return (
                <ProgressBar bsStyle="info" now={progress} label={remainingMins + " mins"} />
            );
        } else if (this.props.build.isSuccess()) {
            return (
                <ProgressBar bsStyle="success" now={100} label={Math.ceil(this.props.build.duration / 60000) + " mins"}/>
            );
        }
    }

    renderActions() {
        if (!this.props.build.building) {
            if (this.props.build.isSuccess()) {
                return (
                    <ModalTrigger modal={<Merge build={this.props.build}/>}>
                        <Button bsStyle="success" style={{float: "right"}}>Merge!</Button>
                    </ModalTrigger>
                );
            } else {
                return (
                    <a className="btn btn-default" style={{float: "right"}} href={this.getLink() + "/rebuild/parameterized"}>Rebuild</a>
                );
            }
        }
    }

    renderTestFailures() {
        if (this.props.build.isUnstable() && this.props.testReport) {
            if (this.props.testReport.failCount > 10) {
                return <span>{this.props.testReport.failCount} tests failed.</span>
            }

            return _.map(this.props.testReport.getFailingTests(), (failure) => {
                var key = this.props.build.id + failure.file + failure.name;
                key = key.replace(" ", "-").replace(".", "-");

                var pack = failure.file.substr(0, failure.file.lastIndexOf("."));
                var klass = failure.file.substr(failure.file.lastIndexOf(".") + 1);
                var link = "/job/integration-test-generic-build/" + this.props.build.id + "/testReport/junit/" + pack + "/" + klass + "/" + failure.name.replace(/ /g, "_");

                return (
                    <div key={key}>
                        <a href={link} target="_blank">{klass}: {failure.name}</a>
                    </div>
                );
            });
        }
    }

    render() {
        var style;
        if (this.props.build.building) {
            style = "info";
        } else {
            if (this.props.build.isSuccess()) {
                style = "success"
            } else if (this.props.build.isUnstable()) {
                style = "warning"
            } else {
                style = "danger";
            }
        }

        return (
            <Panel bsStyle={style} header={this.renderHeader()}>
                {this.renderActions()}
                {this.renderProgress()}
                {this.renderBranches()}
                {this.renderTestFailures()}
            </Panel>
        );
    }
}
