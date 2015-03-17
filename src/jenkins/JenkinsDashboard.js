import React from "react";
import BuildsStore from "./BuildsStore";
import RecentBuilds from "./RecentBuilds";
import "bootstrap/dist/css/bootstrap.css";


export default class JenkinsDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.buildsStore = new BuildsStore();
    }

    render() {
        return (
            <div>
                <RecentBuilds buildsStore={this.buildsStore}/>
            </div>
        );
    }
}
