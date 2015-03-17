import React from "react";
import _ from "lodash";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import BuildStatus from "./BuildStatus";

export default class RecentBuilds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            builds: this.props.buildsStore.getRecentBuilds(),
            now: Date.now()
        };

        this.subscribe(this.props.buildsStore.onRecentBuildsChanged(this.onRecentBuildsChanged.bind(this)));
        this.interval = setInterval(() => {
            this.setState({now: Date.now()});
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onRecentBuildsChanged(builds) {
        this.setState({builds: builds});
    }

    renderBuilds() {
        return _.map(this.state.builds, (build) => {
            return <BuildStatus key={build.id} build={build} now={this.state.now}/>
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
