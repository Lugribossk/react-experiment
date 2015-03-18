import React from "react";
import _ from "lodash";
import moment from "moment";
import {TabbedArea, TabPane} from "react-bootstrap"
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import BuildStatus from "./BuildStatus";
import UnstableStats from "./UnstableStats";

export default class RecentBuilds extends React.Component {
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

    renderBuilds(filter) {
        var builds = this.state.builds;
        if (filter) {
            builds = _.filter(builds, filter);
        }

        return _.map(builds, (build) => {
            return <BuildStatus key={build.id}
                build={build}
                testReport={this.state.testReports[build.id]}
                failureData={this.state.failureData[build.id]}
                subsets={this.state.subsets[build.id]}
                now={this.state.now}/>
        });
    }

    render() {
        return (
            <TabbedArea defaultActiveKey={1} animation={false}>
                <TabPane eventKey={1} tab="All">
                    {this.renderBuilds()}
                </TabPane>
                <TabPane eventKey={2} tab="Failed">
                    {this.renderBuilds((build) => {
                        return build.isFailed();
                    })}
                </TabPane>
                <TabPane eventKey={3} tab="Unstable">
                    {this.renderBuilds((build) => {
                        return build.isUnstable();
                    })}
                </TabPane>
                <TabPane eventKey={4} tab="Succeeded">
                    {this.renderBuilds((build) => {
                        return build.isSuccess();
                    })}
                </TabPane>
                <TabPane eventKey={5} tab="Last night">
                    {this.renderBuilds((build) => {
                        var started = moment(build.timestamp);
                        var thisMorning = moment().startOf("day").add(7, "hours");
                        var yesterdayEvening = moment().startOf("day").subtract(6, "hours");

                        return started.isAfter(yesterdayEvening) && started.isBefore(thisMorning);
                    })}
                </TabPane>
                <TabPane eventKey={6} tab="Stats">
                    <UnstableStats buildsStore={this.props.buildsStore}/>
                </TabPane>
            </TabbedArea>
        );
    }
}

Mixins.add(RecentBuilds.prototype, [SubscribeMixin]);
