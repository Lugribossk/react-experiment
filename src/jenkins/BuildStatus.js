import React from "react";
import _ from "lodash";
import moment from "moment";
import {Panel, ProgressBar, ModalTrigger, Button, Alert, Glyphicon} from "react-bootstrap"
import Merge from "./Merge";
import BuildActions from "./BuildActions";

var ESTIMATED_DURATION_MINS = 30,
    NUM_SUBSETS = 24;

export default class BuildStatus extends React.Component {
    getLink() {
        return "/job/integration-test-generic-build/" + this.props.build.number;
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
                <a href={this.getLink()} target="_blank">{"#" + this.props.build.number} - {this.props.build.getUsername()}</a>
                <span style={{float: "right"}}>{this.props.build.keepLog && <Glyphicon glyph="lock" title="Kept forever"/>} {displaytime}</span>
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

    renderProgress() {
        if (this.props.build.building) {
            var estimatedDuration = ESTIMATED_DURATION_MINS * 60 * 1000;
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
                        <Button style={{float: "right"}}>Merge!</Button>
                    </ModalTrigger>
                );
            } else {
                var rebuild = () => {
                    BuildActions.trigger("integration-test-generic-build", this.props.build.getParameters());
                };
                return (
                    <Button onClick={rebuild} style={{float: "right"}}>Rebuild</Button>
                );
            }
        } else {
            var abort = () => {
                BuildActions.abort(this.props.build);
                _.forEach(this.props.subsets || [], (subset) => {
                    BuildActions.abort(subset);
                });
            };
            return (
                <Button onClick={abort} style={{float: "right"}} title="Abort build and subsets">Abort</Button>
            );
        }
    }

    renderTestFailures() {
        if (this.props.build.isUnstable() && this.props.testReport) {
            if (this.props.testReport.failCount > 10) {
                return <span>{this.props.testReport.failCount} tests failed.</span>
            }

            return _.map(this.props.testReport.getFailingTests(), (failure) => {
                var key = this.props.build.number + failure.file + failure.name;
                key = key.replace(/ /g, "-").replace(/\./g, "-");

                var pack = failure.file.substr(0, failure.file.lastIndexOf("."));
                var klass = failure.file.substr(failure.file.lastIndexOf(".") + 1);
                var link = this.getLink() + "/testReport/junit/" + pack + "/" + klass + "/" + failure.name.replace(/ /g, "_");

                return (
                    <div key={key}>
                        <a href={link} target="_blank" className="text-warning">{klass}: {failure.name}</a>
                    </div>
                );
            });
        }
    }

    renderBuildFailure() {
        if (this.props.build.isFailed() && this.props.failureData) {
            var data = this.props.failureData;
            if (data.misspelledBranch) {
                return <span>Branch does not exist: {data.misspelledBranch}</span>;
            } else if (data.noFastForward) {
                return <span>Branch not up to date with master: {data.noFastForward}</span>;
            } else if (data.notBuilt) {
                return <span>Branch not built for projects: {data.notBuilt}</span>;
            }
        }

        if (this.props.build.isAborted()) {
            return <span>Build aborted.</span>;
        }
    }

    renderSubsets() {
        if (!this.props.build.building || !this.props.subsets) {
            return;
        }
        var finishedSubsets = _.filter(this.props.subsets, (subset) => {
            return !subset.building && subset.isSuccess();
        });
        var failedSubsets = _.filter(this.props.subsets, (subset) => {
            return !subset.building && !subset.isSuccess();
        });

        return (
            <ProgressBar label="test">
                <ProgressBar bsStyle="danger" now={Math.round(failedSubsets.length / this.props.subsets.length * 100)} label={failedSubsets.length} key={1} />
                <ProgressBar bsStyle="success" now={Math.round(finishedSubsets.length / this.props.subsets.length * 100)} key={2} />
            </ProgressBar>
        );
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
                {this.renderSubsets()}
                {this.renderBranches()}
                {this.renderTestFailures()}
                {this.renderBuildFailure()}
            </Panel>
        );
    }
}
