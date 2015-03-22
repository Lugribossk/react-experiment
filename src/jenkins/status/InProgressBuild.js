import React from "react";
import _ from "lodash";
import {ProgressBar, Button} from "react-bootstrap"
import BuildActions from "../build/BuildActions";
import BuildUtils from "../build/BuildUtils";
import ParameterDetails from "../ui/ParameterDetails";

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
        var percent = BuildUtils.estimatePercentComplete(this.props.build, this.props.now, this.props.builds);
        var remainingMins = BuildUtils.estimateMinutesRemaining(this.props.build, this.props.now, this.props.builds);

        return (
            <div>
                <Button onClick={this.abort.bind(this)} style={{float: "right"}} title="Abort build and subsets" disabled={this.state.aborted}>
                    {this.state.aborted ? "Aborted" : "Abort"}
                </Button>
                <ProgressBar bsStyle="info" now={percent} label={remainingMins + " mins"} />
                {this.renderSubsets()}
                <ParameterDetails parameters={this.props.build.getParameters()} />
            </div>
        );
    }
}