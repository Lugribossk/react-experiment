import React from "react";
import _ from "lodash";
import {ProgressBar, Button} from "react-bootstrap"
import BuildActions from "../build/BuildActions";

var ESTIMATED_DURATION_MINS = 30;

export default class InProgressBuild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aborted: false
        };
    }

    abort() {
        this.setState({aborted: true});
        BuildActions.abort(this.props.build);
        _.forEach(this.props.subsets || [], (subset) => {
            BuildActions.abort(subset);
        });
    }

    renderSubsets() {
        if (!this.props.subsets) {
            return;
        }
        var finishedSubsets = _.filter(this.props.subsets, (subset) => {
            return !subset.building && subset.isSuccess();
        });
        var failedSubsets = _.filter(this.props.subsets, (subset) => {
            return !subset.building && !subset.isSuccess();
        });

        return (
            <div>
                <ProgressBar>
                    <ProgressBar bsStyle="danger" label={failedSubsets.length} key={1}
                        now={Math.round(failedSubsets.length / this.props.subsets.length * 100)} />
                    <ProgressBar bsStyle="success" key={2}
                        now={Math.round(finishedSubsets.length / this.props.subsets.length * 100)} />
                </ProgressBar>
                {_.map(failedSubsets, (subset) => {
                    return <a key={subset.number} href={subset.url} target="_blank">{subset.number} </a>
                })}
            </div>
        );
    }

    render() {
        var estimatedDuration = ESTIMATED_DURATION_MINS * 60 * 1000;
        var started = this.props.build.timestamp;
        var runningFor = this.props.now - started;
        var progress = Math.round(runningFor / estimatedDuration * 100);

        var remainingMins = Math.ceil((estimatedDuration - runningFor) / 60000);

        return (
            <div>
                <Button onClick={this.abort.bind(this)} style={{float: "right"}} title="Abort build and subsets" disabled={this.state.aborted}>
                    {this.state.aborted ? "Aborted" : "Abort"}
                </Button>
                <ProgressBar bsStyle="info" now={progress} label={remainingMins + " mins"} />
                {this.renderSubsets()}
                {this.props.children}
            </div>
        );
    }
}