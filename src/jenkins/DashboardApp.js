import React from "react";
import _ from "lodash";
import JobStore from "./job/JobStore";
import JobService from "./job/JobService";
import BuildService from "./build/BuildService";
import NotificationService from "./NotificationService";
import IntegrationTests from "./IntegrationTests";
import "bootstrap/dist/css/bootstrap.css";

export default class DashboardApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            integrationTests: new JobStore("integration-test-generic-build"),
            subsets: new JobStore("integration-test-build-subset", 100)
        };

        new JobService();
        new BuildService();
        new NotificationService(this.state.integrationTests);

        localStorage.clear();
    }

    render() {
        return (
            <div>
                <IntegrationTests integrationTests={this.state.integrationTests} subsets={this.state.subsets}/>
            </div>
        );
    }
}
