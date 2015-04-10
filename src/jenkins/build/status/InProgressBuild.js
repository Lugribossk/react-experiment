import React from "react";
import _ from "lodash";
import {ProgressBar} from "react-bootstrap"
import BuildUtils from "../BuildUtils";
import ParameterDetails from "../../ui/ParameterDetails";
import AbortButton from "./AbortButton";

export default class InProgressBuild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aborted: false
        };
    }

    renderSubsets() {
        if (!this.props.subsets) {
            return null;
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
                    <ProgressBar bsStyle="danger" label={failedSubsets.length + " failed subsets"} key={1}
                        now={Math.round(failedSubsets.length / this.props.subsets.length * 100)} />
                    <ProgressBar bsStyle="success" label={finishedSubsets.length + " successful subsets"} key={2}
                        now={Math.round(finishedSubsets.length / this.props.subsets.length * 100)} />
                </ProgressBar>
                {failedSubsets.length > 0 &&
                    <span>Failed subsets: </span>}
                {_.map(failedSubsets, (subset) => {
                    return <a key={subset.getId()} href={subset.url} target="_blank">{subset.getId()} </a>;
                })}
            </div>
        );
    }

    render() {
        var percent = BuildUtils.estimatePercentComplete(this.props.build, this.props.now, this.props.builds);
        var remainingMins = BuildUtils.getEstimatedDurationText(this.props.build, this.props.now, this.props.builds);

        return (
            <div>
                <AbortButton build={this.props.build} subsets={this.props.subsets} />
                <ProgressBar bsStyle="info" now={percent} label={remainingMins} />
                {this.renderSubsets()}
                <ParameterDetails parameters={this.props.build.getParameters()} />
            </div>
        );
    }
}
