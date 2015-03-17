import React from "react";
import _ from "lodash";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import BuildStatus from "./BuildStatus";

export default class RecentBuilds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            builds: this.props.buildsStore.getRecentBuilds()
        };

        this.subscribe(this.props.buildsStore.onRecentBuildsChanged(this.onRecentBuildsChanged.bind(this)));
    }

    onRecentBuildsChanged(builds) {
        this.setState({builds: builds});
    }

    renderBuilds() {
        return _.map(this.state.builds, (build) => {
            return <BuildStatus key={build.id} {...build}/>
        });
    }

    render() {
        return (
            <div>
                {this.renderBuilds()}
            </div>
        );
    }
}

Mixins.add(RecentBuilds.prototype, [SubscribeMixin]);
