import React from "react";
import _ from "lodash";
import {Button} from "react-bootstrap"
import JobActions from "../../job/JobActions";
import ParameterDetails from "../../ui/ParameterDetails";

export default class UnstableBuild extends React.Component {
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

    renderTestFailures() {
        if (this.props.testReport && this.props.testReport.failCount > 10) {
            return <span>{this.props.testReport.failCount} tests failed.</span>
        }

        if (this.props.testReport && this.props.testReport.failCount > 0) {
            return _.map(this.props.testReport.getFailedTests(), (failure) => {
                var key = this.props.build.getId() + failure.file + failure.name;
                key = key.replace(/ /g, "-").replace(/\./g, "-");

                var pack = failure.file.substr(0, failure.file.lastIndexOf("."));
                var klass = failure.file.substr(failure.file.lastIndexOf(".") + 1);
                var link = this.props.build.url + "testReport/junit/" + pack + "/" + klass + "/" + failure.name.replace(/ /g, "_");

                return (
                    <div key={key}>
                        <a href={link} target="_blank" className="text-warning">{klass}: {failure.name}</a>
                    </div>
                );
            });
        }

        if (this.props.subsets) {
            var failedSubsets = _.filter(this.props.subsets, (subset) => {
                return !subset.building && !subset.isSuccess();
            });

            if (failedSubsets.length > 0) {
                return (
                    <span>
                        Unstable with 0 failing tests, failing subsets:
                        {_.map(failedSubsets, (subset) => {
                            return <a key={subset.getId()} href={subset.url} target="_blank"> {subset.getId()}</a>
                        })}
                    </span>
                );
            }
        }

        return <span>Unstable with 0 failing tests, but subset information is no longer available.</span>;
    }

    render() {
        return (
            <div>
                <Button onClick={this.rebuild.bind(this)} style={{float: "right"}} disabled={this.state.rebuilt}>
                    {this.state.rebuilt ? "Rebuilding" : "Rebuild"}
                </Button>
                <ParameterDetails parameters={this.props.build.getParameters()} />
                {this.renderTestFailures()}
            </div>
        );
    }
}