import React from "react";
import _ from "lodash";
import moment from "moment";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import BuildStatus from "./BuildStatus";
import UnstableStats from "./UnstableStats";
import JobActions from "./job/JobActions";

export default class RecentBuilds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            integrationTests: this.props.integrationTests.getBuilds(),
            testReports: this.props.integrationTests.getTestReports(),
            failureData: this.props.integrationTests.getFailureData(),
            subsets: this._getSubsets(),
            now: Date.now()
        };

        this.subscribe(this.props.integrationTests.onBuildsChanged(this.onIntegrationTestsChanged.bind(this)));
        this.subscribe(this.props.integrationTests.onTestReportsChanged(this.onTestReportsChanged.bind(this)));
        this.subscribe(this.props.integrationTests.onFailureDataChanged(this.onFailureDataChanged.bind(this)));
        this.subscribe(this.props.subsets.onBuildsChanged(this.onSubsetsChanged.bind(this)));
        this.interval = setInterval(() => {
            this.setState({now: Date.now()});
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onIntegrationTestsChanged() {
        this.setState({integrationTests: this.props.integrationTests.getBuilds()});
    }

    onTestReportsChanged() {
        this.setState({testReports: this.props.integrationTests.getTestReports()});
    }

    onFailureDataChanged() {
        this.setState({failureData: this.props.integrationTests.getFailureData()});
    }

    onSubsetsChanged() {
        this.setState({subsets: this._getSubsets()});
    }

    _getSubsets() {
        var buildToSubsets = {};
        _.forEach(this.props.subsets.getBuilds(), (subset) => {
            var upstream = subset.getUpstream();
            if (upstream.name === "integration-test-generic-build") {
                if (!buildToSubsets[upstream.id]) {
                    buildToSubsets[upstream.id] = [];
                }
                buildToSubsets[upstream.id].push(subset);
            }
        });
        return buildToSubsets;
    }

    renderBuilds(builds) {
        return _.map(builds, (build) => {
            return <BuildStatus
                key={build.number}
                build={build}
                builds={this.state.integrationTests}
                testReport={this.state.testReports[build.number]}
                failureData={this.state.failureData[build.number]}
                subsets={this.state.subsets[build.number]}
                now={this.state.now}/>
        });
    }

    render() {
        var allBuilds = this.state.integrationTests;
        var failedBuilds = _.filter(allBuilds, (build) => {
            return build.isFailed() || build.isAborted();
        });
        var unstableBuilds = _.filter(allBuilds, (build) => {
            return build.isUnstable();
        });
        var successBuilds = _.filter(allBuilds, (build) => {
            return build.isSuccess();
        });
        var overnightBuilds = _.filter(this.state.builds, (build) => {
            var started = moment(build.timestamp);
            var thisMorning = moment().startOf("day").add(7, "hours");
            var yesterdayEvening = moment().startOf("day").subtract(6, "hours");

            return started.isAfter(yesterdayEvening) && started.isBefore(thisMorning);
        });
        return (
            <TabbedArea defaultActiveKey={1} animation={false}>
                <TabPane eventKey={1} tab={<span>All <Badge>{allBuilds.length}</Badge></span>}>
                    {this.renderBuilds(allBuilds)}
                </TabPane>
                <TabPane eventKey={2} tab={<span>Failed <Badge>{failedBuilds.length}</Badge></span>}>
                    {this.renderBuilds(failedBuilds)}
                </TabPane>
                <TabPane eventKey={3} tab={<span>Unstable <Badge>{unstableBuilds.length}</Badge></span>}>
                    {this.renderBuilds(unstableBuilds)}
                </TabPane>
                <TabPane eventKey={4} tab={<span>Succeeded <Badge>{successBuilds.length}</Badge></span>}>
                    {this.renderBuilds(successBuilds)}
                </TabPane>
                <TabPane eventKey={5} tab="Last night">
                    {this.renderBuilds(overnightBuilds)}
                </TabPane>
                <TabPane eventKey={6} tab="Stats">
                    <UnstableStats integrationTests={this.props.integrationTests}/>
                </TabPane>
                <TabPane eventKey={7} tab="Cleanup">
                    <Button bsStyle="warning" onClick={() => {
                        JobActions.unkeepBuilds("integration-test-generic-build", moment().subtract(14, "days"));
                    }}>Stop keeping any build that is older than 14 days</Button>
                </TabPane>
            </TabbedArea>
        );
    }
}

Mixins.add(RecentBuilds.prototype, [SubscribeMixin]);
