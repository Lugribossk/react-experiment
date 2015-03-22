import React from "react";
import _ from "lodash";
import {Navbar, Nav, NavItem, Button, Badge} from "react-bootstrap"
import JobStore from "./job/JobStore";
import JobService from "./job/JobService";
import BuildService from "./build/BuildService";
import NotificationService from "./NotificationService";
import IntegrationTests from "./IntegrationTests";
import "bootstrap/dist/css/bootstrap.css";
import UnstableStats from "./UnstableStats";
import JobActions from "./job/JobActions";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import moment from "moment";

export default class DashboardApp extends React.Component {
    constructor(props) {
        super(props);

        this.integrationTests = new JobStore("integration-test-generic-build");
        this.subsets = new JobStore("integration-test-build-subset", 100);

        this.state = _.assign({
            testReports: this.integrationTests.getTestReports(),
            failureData: this.integrationTests.getFailureData(),
            subsets: this._getSubsets(),
            route: window.location.href.split("#")[1] || ""
        }, this._getBuilds());

        this.subscribe(this.integrationTests.onBuildsChanged(this.whenIntegrationTestsChanged.bind(this)));
        this.subscribe(this.integrationTests.onTestReportsChanged(this.whenTestReportsChanged.bind(this)));
        this.subscribe(this.integrationTests.onFailureDataChanged(this.whenFailureDataChanged.bind(this)));
        this.subscribe(this.subsets.onBuildsChanged(this.whenSubsetsChanged.bind(this)));
        this.interval = setInterval(() => {
            this.setState({now: Date.now()});
        }, 10000);

        window.addEventListener("hashchange", this.whenHashChange.bind(this));

        new JobService();
        new BuildService();
        new NotificationService(this.integrationTests);

        localStorage.clear();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    whenIntegrationTestsChanged() {
        this.setState(this._getBuilds());
    }

    whenTestReportsChanged() {
        this.setState({testReports: this.integrationTests.getTestReports()});
    }

    whenFailureDataChanged() {
        this.setState({failureData: this.integrationTests.getFailureData()});
    }

    whenSubsetsChanged() {
        this.setState({subsets: this._getSubsets()});
    }

    _getBuilds() {
        var allBuilds = this.integrationTests.getBuilds();
        var failedBuilds = _.filter(allBuilds, (build) => {
            return build.isFailed() || build.isAborted();
        });
        var unstableBuilds = _.filter(allBuilds, (build) => {
            return build.isUnstable();
        });
        var successBuilds = _.filter(allBuilds, (build) => {
            return build.isSuccess();
        });
        var overnightBuilds = _.filter(allBuilds, (build) => {
            var started = moment(build.timestamp);
            var thisMorning = moment().startOf("day").add(7, "hours");
            var yesterdayEvening = moment().startOf("day").subtract(6, "hours");

            return started.isAfter(yesterdayEvening) && started.isBefore(thisMorning);
        });
        return {
            allBuilds: allBuilds,
            failedBuilds: failedBuilds,
            unstableBuilds: unstableBuilds,
            successBuilds: successBuilds,
            overnightBuilds: overnightBuilds
        }
    }

    _getSubsets() {
        var buildToSubsets = {};
        _.forEach(this.subsets.getBuilds(), (subset) => {
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

    whenHashChange(event) {
        var hash = event.newURL.split("#")[1];
        this.setState({route: hash});
    }

    isActive(link) {
        var route = this.state.route;
        var isDefault = (route === "" && link === "#");
        var isSubpath = (route.indexOf(link) === 0);

        return isDefault || isSubpath
    }

    renderRoute() {
        var data = {
            allBuilds: this.state.allBuilds,
            testReports: this.state.testReports,
            failureData: this.state.failureData,
            subsets: this.state.subsets
        };
        if (this.state.route === "failed") {
            return <IntegrationTests builds={this.state.failedBuilds} {...data}/>
        } else if (this.state.route === "unstable") {
            return <IntegrationTests builds={this.state.unstableBuilds} {...data}/>
        } else if (this.state.route === "success") {
            return <IntegrationTests builds={this.state.successBuilds} {...data}/>
        } else if (this.state.route === "lastnight") {
            return <IntegrationTests builds={this.state.overnightBuilds} {...data}/>
        } else if (this.state.route === "stats") {
            return <UnstableStats integrationTests={this.integrationTests}/>;
        } else if (this.state.route === "actions") {
            return (
                <Button bsStyle="warning" onClick={() => {
                    JobActions.unkeepBuilds("integration-test-generic-build", moment().subtract(14, "days"));
                }}>Stop keeping any build that is older than 14 days</Button>
            );
        } else {
            return <IntegrationTests builds={this.state.allBuilds} {...data}/>
        }
    }

    render() {
        return (
            <div>
                <Navbar brand="ITs" toggleNavKey={0}>
                    <Nav eventKey={0}>
                        <NavItem href="#" active={this.isActive("#")}>
                            All <Badge>{this.state.allBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#failed" active={this.isActive("failed")}>
                            Failed <Badge>{this.state.failedBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#unstable" active={this.isActive("unstable")}>
                            Unstable<Badge>{this.state.unstableBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#success" active={this.isActive("success")}>
                            Succeeded <Badge>{this.state.successBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#lastnight" active={this.isActive("lastnight")}>
                            Last night
                        </NavItem>
                        <NavItem href="#stats" active={this.isActive("stats")}>
                            Stats
                        </NavItem>
                        <NavItem href="#actions" active={this.isActive("actions")}>
                            Cleanup
                        </NavItem>
                    </Nav>
                </Navbar>
                <div className="container">
                    {this.renderRoute()}
                </div>
            </div>
        );
    }
}

Mixins.add(DashboardApp.prototype, [SubscribeMixin]);