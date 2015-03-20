import React from "react";
import JobStore from "./JobStore";
import RecentBuilds from "./RecentBuilds";
import "bootstrap/dist/css/bootstrap.css";

export default class IntegrationTestDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            integrationTests: new JobStore("integration-test-generic-build"),
            subsets: new JobStore("integration-test-build-subset")
        }
    }

    render() {
        return (
            <div>
                <RecentBuilds integrationTests={this.state.integrationTests} subsets={this.state.subsets}/>
            </div>
        );
    }
}
