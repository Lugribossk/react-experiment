import React from "react";
import _ from "lodash";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import BuildStatus from "./BuildStatus";
import QueueStatus from "./queue/QueueStatus";

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
            return;
        }
        return _.map(this.props.queue, (item) => {
            return <QueueStatus key={"q" + item.id} item={item} />
        });
    }

    renderBuilds() {
        if (this.props.builds.length === 0) {
            return <div>No matching builds.</div>;
        }
        return _.map(this.props.builds, (build) => {
            return <BuildStatus
                key={"b" + build.number}
                build={build}
                builds={this.props.allBuilds}
                testReport={this.props.testReports[build.number]}
                failureData={this.props.failureData[build.number]}
                subsets={this.props.subsets[build.number]}
                now={this.state.now}/>
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

