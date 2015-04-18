import React from "react";
import _ from "lodash";
import JobStore from "./job/JobStore";
import UserStore from "./user/UserStore";
import QueueStore from "./queue/QueueStore";
import JobService from "./job/JobService";
import BuildService from "./build/BuildService";
import NotificationService from "./NotificationService";
import IntegrationTestList from "./IntegrationTestList";
import "bootstrap/dist/css/bootstrap.css";
import UnstableStats from "./stats/UnstableStats";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import Route from "../flux/Route";
import NodeStore from "./node/NodeStore";
import Nodes from "./node/Nodes";
import SearchableIntegrationTestList from "./SearchableIntegrationTestList";
import BuildsNavbar from "./BuildsNavbar";
import DesktopNotificationPrompt from "./ui/DesktopNotificationPrompt";

/**
 * Dashboard for showing status and parameters of the integration test build job in Jenkins.
 */
export default class DashboardApp extends React.Component {
    constructor(props) {
        super(props);

        this.integrationTests = new JobStore("integration-test-generic-build", 80);
        this.subsets = new JobStore("integration-test-build-subset", 100, false);
        this.userStore = new UserStore();
        this.queueStore = new QueueStore("integration-test-generic-build");
        this.nodeStore = new NodeStore("it");

        this.currentUser = this.userStore.getCurrentUser();

        this.state = {
            testReports: this.integrationTests.getTestReports(),
            failureData: this.integrationTests.getFailureData(),
            subsets: this._getSubsets(),
            currentUser: this.currentUser,
            allBuilds: this.integrationTests.getBuilds(),
            failedBuilds: this.integrationTests.getFailedBuilds(),
            unstableBuilds: this.integrationTests.getUnstableBuilds(),
            successBuilds: this.integrationTests.getSuccessfulBuilds(),
            overnightBuilds: this.integrationTests.getLastNightBuilds(),
            myBuilds: this.integrationTests.getUserBuilds(this.currentUser),
            queue: this.queueStore.getQueue(),
            totalNodes: this.nodeStore.getNumTotalNodes()
        };

        this.subscribe(this.integrationTests.onBuildsChanged(this.whenIntegrationTestsChanged.bind(this)));
        this.subscribe(this.integrationTests.onTestReportsChanged(this.whenTestReportsChanged.bind(this)));
        this.subscribe(this.integrationTests.onFailureDataChanged(this.whenFailureDataChanged.bind(this)));
        this.subscribe(this.subsets.onBuildsChanged(this.whenSubsetsChanged.bind(this)));
        this.subscribe(this.userStore.onCurrentUserChanged(this.whenCurrentUserChanged.bind(this)));
        this.subscribe(this.queueStore.onQueueChanged(this.whenQueueChanged.bind(this)));
        this.subscribe(this.nodeStore.onNodeCountChanged(this.whenNodeCountChanged.bind(this)));
        this.subscribe(Route.getRouter().onRouteChange(this.forceUpdate.bind(this)));

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

    whenQueueChanged() {
        this.setState({queue: this.queueStore.getQueue()});
    }

    whenNodeCountChanged() {
        this.setState({totalNodes: this.nodeStore.getNumTotalNodes()});
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

    renderRoute() {
        var data = {
            allBuilds: this.state.allBuilds,
            testReports: this.state.testReports,
            failureData: this.state.failureData,
            subsets: this.state.subsets
        };
        var myQueue = _.filter(this.state.queue, (item) => {
            return item.getUserId() === this.state.currentUser.id;
        });
        return (
            <div>
                <Route path="failed">
                    <IntegrationTestList builds={this.state.failedBuilds} {...data} />
                </Route>
                <Route path="unstable">
                    <IntegrationTestList builds={this.state.unstableBuilds} {...data} />
                </Route>
                <Route path="success">
                    <IntegrationTestList builds={this.state.successBuilds} {...data} />
                </Route>
                <Route path="mine">
                    <IntegrationTestList builds={this.state.myBuilds} queue={myQueue} {...data} />
                </Route>
                <Route path="lastnight">
                    <IntegrationTestList builds={this.state.overnightBuilds} {...data}/>
                </Route>
                <Route path="search/:query?">
                    <SearchableIntegrationTestList builds={this.state.allBuilds} {...data}/>
                </Route>
                <Route path="stats">
                    <UnstableStats integrationTests={this.integrationTests} {...data}/>
                </Route>
                <Route path="nodes">
                    <Nodes nodeStore={this.nodeStore} currentUser={this.state.currentUser} />
                </Route>
                <Route defaultPath>
                    <IntegrationTestList builds={this.state.allBuilds} queue={this.state.queue} {...data} />
                </Route>
            </div>
        );
    }

    render() {
        var navbarProps = {
            all: this.state.allBuilds.length,
            failed: this.state.failedBuilds.length,
            unstable: this.state.unstableBuilds.length,
            success: this.state.successBuilds.length,
            mine: this.state.myBuilds.length,
            totalNodes: this.state.totalNodes,
            router: Route.getRouter()
        };
        return (
            <div>
                <BuildsNavbar {...navbarProps} />
                <div className="container">
                    <DesktopNotificationPrompt />
                    {this.renderRoute()}
                </div>
            </div>
        );
    }
}

Mixins.add(DashboardApp.prototype, [SubscribeMixin]);
