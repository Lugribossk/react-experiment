import React from "react";
import _ from "lodash";
import moment from "moment";
import {TabbedArea, TabPane, Badge, Button, Glyphicon} from "react-bootstrap"
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import BuildStatus from "./BuildStatus";
import UnstableStats from "./UnstableStats";
import BuildActions from "./BuildActions";

export default
class RecentBuilds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            builds: this.props.buildsStore.getBuilds(),
            testReports: this.props.buildsStore.getTestReports(),
            failureData: this.props.buildsStore.getFailureData(),
            now: Date.now(),
            subsets: this._getSubsets()
        };

        this.subscribe(this.props.buildsStore.onBuildsChanged(this.onBuildsChanged.bind(this)));
        this.subscribe(this.props.buildsStore.onTestReportsChanged(this.onTestReportsChanged.bind(this)));
        this.subscribe(this.props.buildsStore.onFailureDataChanged(this.onFailureDataChanged.bind(this)));
        this.interval = setInterval(() => {
            this.setState({now: Date.now()});
        }, 10000);
        this.subscribe(this.props.subsetStore.onBuildsChanged(this.onSubsetsChanged.bind(this)));
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onBuildsChanged(builds) {
        this.setState({builds: builds});
    }

    onTestReportsChanged(reports) {
        this.setState({testReports: reports});
    }

    onFailureDataChanged(data) {
        this.setState({failureData: data});
    }

    onSubsetsChanged(data) {
        this.setState({subsets: this._getSubsets()});
    }

    _getSubsets() {
        var buildToSubsets = {};
        _.forEach(this.props.subsetStore.getBuilds(), (subset) => {
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
                testReport={this.state.testReports[build.number]}
                failureData={this.state.failureData[build.number]}
                subsets={this.state.subsets[build.number]}
                now={this.state.now}/>
        });
    }

    render() {
        var allBuilds = this.state.builds;
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
                    <UnstableStats buildsStore={this.props.buildsStore}/>
                </TabPane>
                <TabPane eventKey={7} tab="Cleanup">
                    <Button bsStyle="warning" onClick={() => {
                        BuildActions.unkeepBuilds("integration-test-generic-build", moment().subtract(14, "days"));
                    }}>Stop keeping builds older than 14 days</Button>
                </TabPane>
            </TabbedArea>
        );
    }
}

Mixins.add(RecentBuilds.prototype, [SubscribeMixin]);
