import React from "react";
import _ from "lodash";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import BuildStatus from "./BuildStatus";


export default class IntegrationTests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: Date.now()
        };

        this.interval = setInterval(() => {
            this.setState({now: Date.now()});
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        var status = _.map(this.props.builds, (build) => {
            return <BuildStatus
                key={build.number}
                build={build}
                builds={this.props.allBuilds}
                testReport={this.props.testReports[build.number]}
                failureData={this.props.failureData[build.number]}
                subsets={this.props.subsets[build.number]}
                now={this.state.now}/>
        });
        return (
            <div>
                {status}
            </div>
        );
    }
}

