import React from "react";
import _ from "lodash";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import BuildStatus from "./build/BuildStatus";
import QueueStatus from "./queue/QueueStatus";
import BuildUtils from "./build/BuildUtils";

/**
 * Show a list of integration test builds, and possibly any queued builds.
 */
export default class IntegrationTestList extends React.Component {
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

    renderQueue() {
        if (!this.props.queue || this.props.queue.length === 0) {
            return null;
        }
        return _.map(this.props.queue, (item) => {
            return <QueueStatus key={"q" + item.getId()} item={item} />;
        });
    }

    renderBuilds() {
        var builds = this.props.builds;
        if (builds.length === 0) {
            return <div>No matching builds.</div>;
        }
        return _.map(builds, (build) => {
            var id = build.getId();
            return <BuildStatus
                key={"b" + id}
                build={build}
                builds={this.props.allBuilds}
                testReport={this.props.testReports[id]}
                failureData={this.props.failureData[id]}
                subsets={this.props.subsets[id]}
                now={this.state.now}/>;
        });
    }

    render() {
        return (
            <div>
                {this.renderQueue()}
                {this.renderBuilds()}
            </div>
        );
    }
}

