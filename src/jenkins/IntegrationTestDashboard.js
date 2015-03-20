import React from "react";
import JobStore from "./job/JobStore";
import JobService from "./job/JobService";
import BuildService from "./build/BuildService";
import RecentBuilds from "./RecentBuilds";
import "bootstrap/dist/css/bootstrap.css";

export default class IntegrationTestDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            integrationTests: new JobStore("integration-test-generic-build"),
            subsets: new JobStore("integration-test-build-subset")
        };

        new JobService();
        new BuildService();
    }

    render() {
        return (
            <div>
                <RecentBuilds integrationTests={this.state.integrationTests} subsets={this.state.subsets}/>
            </div>
        );
    }
}
