import React from "react";
import _ from "lodash";
import {Button} from "react-bootstrap"
import JobActions from "../job/JobActions";

export default class UnstableBuild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rebuilt: false
        };
    }

    rebuild() {
        this.setState({rebuilt: true});
        JobActions.trigger("integration-test-generic-build", this.props.build.getParameters());
    }

    renderTestFailures() {
        if (!this.props.testReport) {
            return;
        }

        if (this.props.testReport.failCount > 10) {
            return <span>{this.props.testReport.failCount} tests failed.</span>
        }

        return _.map(this.props.testReport.getFailedTests(), (failure) => {
            var key = this.props.build.number + failure.file + failure.name;
            key = key.replace(/ /g, "-").replace(/\./g, "-");

            var pack = failure.file.substr(0, failure.file.lastIndexOf("."));
            var klass = failure.file.substr(failure.file.lastIndexOf(".") + 1);
            var link = "/job/integration-test-generic-build/" + this.props.build.number +
                "/testReport/junit/" + pack + "/" + klass + "/" + failure.name.replace(/ /g, "_");

            return (
                <div key={key}>
                    <a href={link} target="_blank" className="text-warning">{klass}: {failure.name}</a>
                </div>
            );
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.rebuild.bind(this)} style={{float: "right"}} disabled={this.state.rebuilt}>
                    {this.state.rebuilt ? "Rebuilding" : "Rebuild"}
                </Button>
                {this.props.children}
                {this.renderTestFailures()}
            </div>
        );
    }
}