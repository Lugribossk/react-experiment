import React from "react";
import _ from "lodash";
import ParameterDetails from "../../ui/ParameterDetails";
import RebuildButton from "./RebuildButton";

export default class FailedBuild extends React.Component {
    renderBuildFailures() {
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
            return <span>Build was aborted.</span>;
        }
    }

    render() {
        return (
            <div>
                <RebuildButton build={this.props.build} />
                <ParameterDetails parameters={this.props.build.getParameters()} />
                {this.renderBuildFailures()}
            </div>
        );
    }
}