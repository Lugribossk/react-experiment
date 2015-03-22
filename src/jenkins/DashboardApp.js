import React from "react";
import _ from "lodash";
import {Navbar, Nav, NavItem, CollapsableNav, Button, Badge, ModalTrigger} from "react-bootstrap"
import JobStore from "./job/JobStore";
import UserStore from "./user/UserStore";
import QueueStore from "./queue/QueueStore";
import JobService from "./job/JobService";
import BuildService from "./build/BuildService";
import NotificationService from "./NotificationService";
import IntegrationTestList from "./IntegrationTestList";
import "bootstrap/dist/css/bootstrap.css";
import UnstableStats from "./UnstableStats";
import JobActions from "./job/JobActions";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import TriggerIntegrationTest from "./TriggerIntegrationTest";

export default class DashboardApp extends React.Component {
    constructor(props) {
        super(props);

        this.integrationTests = new JobStore("integration-test-generic-build");
        this.subsets = new JobStore("integration-test-build-subset", 100);
        this.userStore = new UserStore();
        this.queueStore = new QueueStore("integration-test-generic-build");

        this.currentUser = this.userStore.getCurrentUser();

        this.state = {
            testReports: this.integrationTests.getTestReports(),
            failureData: this.integrationTests.getFailureData(),
            subsets: this._getSubsets(),
            route: window.location.href.split("#")[1] || "",
            currentUser: this.currentUser,
            allBuilds: this.integrationTests.getBuilds(),
            failedBuilds: this.integrationTests.getFailedBuilds(),
            unstableBuilds: this.integrationTests.getUnstableBuilds(),
            successBuilds: this.integrationTests.getSuccessfulBuilds(),
            overnightBuilds: this.integrationTests.getLastNightBuilds(),
            myBuilds: this.integrationTests.getUserBuilds(this.currentUser),
            queue: this.queueStore.getQueue()
        };

        this.subscribe(this.integrationTests.onBuildsChanged(this.whenIntegrationTestsChanged.bind(this)));
        this.subscribe(this.integrationTests.onTestReportsChanged(this.whenTestReportsChanged.bind(this)));
        this.subscribe(this.integrationTests.onFailureDataChanged(this.whenFailureDataChanged.bind(this)));
        this.subscribe(this.subsets.onBuildsChanged(this.whenSubsetsChanged.bind(this)));
        this.subscribe(this.userStore.onCurrentUserChanged(this.whenCurrentUserChanged.bind(this)));
        this.subscribe(this.queueStore.onQueueChanged(this.whenQueueChanged.bind(this)));

        window.addEventListener("hashchange", this.whenHashChange.bind(this));

        new JobService();
        new BuildService();
        new NotificationService(this.integrationTests, this.currentUser && this.currentUser.id);

        localStorage.clear();
    }

    whenIntegrationTestsChanged() {
        this.setState({
            allBuilds: this.integrationTests.getBuilds(),
            failedBuilds: this.integrationTests.getFailedBuilds(),
            unstableBuilds: this.integrationTests.getUnstableBuilds(),
            successBuilds: this.integrationTests.getSuccessfulBuilds(),
            overnightBuilds: this.integrationTests.getLastNightBuilds(),
            myBuilds: this.integrationTests.getUserBuilds(this.state.currentUser)
        });
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

    whenCurrentUserChanged() {
        this.setState({currentUser: this.userStore.getCurrentUser()});
    }

    whenHashChange(event) {
        var hash = event.newURL.split("#")[1];
        this.setState({route: hash});
    }

    whenQueueChanged() {
        this.setState({queue: this.queueStore.getQueue()});
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

    isActive(link) {
        var route = this.state.route;
        var isDefault = (route === "" && link === "#");
        var isSubpath = (route.indexOf(link) === 0);

        return isDefault || isSubpath
    }

    renderNavbar() {
        return (
            <Navbar brand="ITs" toggleNavKey={0}>
                <CollapsableNav eventKey={0}>
                    <Nav navbar>
                        <NavItem href="#" active={this.isActive("#")}>
                            All <Badge>{this.state.allBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#failed" active={this.isActive("failed")}>
                            Failed <Badge>{this.state.failedBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#unstable" active={this.isActive("unstable")}>
                            Unstable <Badge>{this.state.unstableBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#success" active={this.isActive("success")}>
                            Succeeded <Badge>{this.state.successBuilds.length}</Badge>
                        </NavItem>
                        <NavItem href="#mine" active={this.isActive("mine")}>
                            Mine <Badge>{this.state.myBuilds.length}</Badge>
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
                    <ul>
                        <ModalTrigger modal={<TriggerIntegrationTest />}>
                            <Button className="navbar-btn navbar-right" bsStyle="primary">
                                New
                            </Button>
                        </ModalTrigger>
                    </ul>
                </CollapsableNav>
            </Navbar>
        );
    }

    renderRoute() {
        var data = {
            allBuilds: this.state.allBuilds,
            testReports: this.state.testReports,
            failureData: this.state.failureData,
            subsets: this.state.subsets
        };
        if (this.state.route === "failed") {
            return <IntegrationTestList builds={this.state.failedBuilds} {...data}/>
        } else if (this.state.route === "unstable") {
            return <IntegrationTestList builds={this.state.unstableBuilds} {...data}/>
        } else if (this.state.route === "success") {
            return <IntegrationTestList builds={this.state.successBuilds} {...data}/>
        } else if (this.state.route === "mine") {
            var myQueue = _.filter(this.state.queue, (item) => {
                return item.getUserId() === this.state.currentUser.id;
            });
            return <IntegrationTestList builds={this.state.myBuilds} queue={myQueue} {...data}/>
        } else if (this.state.route === "lastnight") {
            return <IntegrationTestList builds={this.state.overnightBuilds} {...data}/>
        } else if (this.state.route === "stats") {
            return <UnstableStats integrationTests={this.integrationTests}/>;
        } else if (this.state.route === "actions") {
            return (
                <Button bsStyle="warning" onClick={() => {
                    JobActions.unkeepBuilds("integration-test-generic-build", moment().subtract(14, "days"));
                }}>Stop keeping any build that is older than 14 days</Button>
            );
        } else {
            return <IntegrationTestList builds={this.state.allBuilds} queue={this.state.queue} {...data}/>
        }
    }

    render() {
        return (
            <div>
                {this.renderNavbar()}
                <div className="container">
                    {this.renderRoute()}
                </div>
            </div>
        );
    }
}

Mixins.add(DashboardApp.prototype, [SubscribeMixin]);