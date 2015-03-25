import React from "react";
import _ from "lodash";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import BuildStatus from "./build/BuildStatus";
import QueueStatus from "./queue/QueueStatus";
import BuildUtils from "./build/BuildUtils";

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
            return <QueueStatus key={"q" + item.getId()} item={item} />
        });
    }

    renderBuilds() {
        var builds = this.props.builds;

        if (this.props.filter) {
            builds = IntegrationTestList.filterBuilds(builds, this.props.filter);
        }

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

    static filterBuilds(builds, text) {
        _.filter(builds, (build) => {
            var hasName = _.contains(build.getUserFullName(), text);
            var hasId = build.getUserId() === text;
            var hasBranchOrRepo = _.some(BuildUtils.getRepoBranches(build.getParameters()), (branch, repo) => {
                return _.contains(branch, text) || _.contains(repo, text);
            });
            var testReport = this.props.testReports[build.getId()];
            var hasTestCase = testReport && _.some(testReport.getFailedTests(), (test) => {
                return _.contains(test.file, text);
            });

            return hasName || hasId || hasBranchOrRepo || hasTestCase;
        });
    }
}

