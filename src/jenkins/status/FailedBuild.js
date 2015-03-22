import React from "react";
import _ from "lodash";
import {Button} from "react-bootstrap"
import JobActions from "../job/JobActions";
import ParameterDetails from "../ui/ParameterDetails";

export default class FailedBuild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rebuilt: false
        };
    }

    rebuild() {
        this.setState({rebuilt: true});
        JobActions.triggerBuild(this.props.build.getJobName(), this.props.build.getParameters());
    }

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
                <Button onClick={this.rebuild.bind(this)} style={{float: "right"}} disabled={this.state.rebuilt}>
                    {this.state.rebuilt ? "Rebuilding" : "Rebuild"}
                </Button>
                <ParameterDetails parameters={this.props.build.getParameters()} />
                {this.renderBuildFailures()}
            </div>
        );
    }
}