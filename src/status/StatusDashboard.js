import React from "react";
import _ from "lodash";
import Mixins from "../util/Mixins";
import ConfigurationStore from "./ConfigurationStore";
import StatusStore from "./StatusStore";
import StatusIndicator from "./StatusIndicator";

export default class StatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.configStore = new ConfigurationStore();
        this.statusStore = new StatusStore(this.configStore);

        this.state = {
            statuses: []
        };

        this.statusStore.onStatusChanged(() => this.setState({statuses: this.statusStore.getStatuses()}));
    }

    render() {
        return (
            <div className="container-fluid">
                {_.map(this.state.statuses, status => <StatusIndicator key={status.title} {...status} />)}
            </div>
        );
    }
}

Mixins.add(StatusDashboard.prototype, [React.addons.PureRenderMixin]);