import React from "react";
import _ from "lodash";
import Mixins from "../util/Mixins";
import ConfigurationStore from "./ConfigurationStore";
import StatusStore from "./StatusStore";
import StatusIndicator from "./StatusIndicator";
import Piecon from "piecon";

export default class StatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.configStore = new ConfigurationStore();
        this.statusStore = new StatusStore(this.configStore);

        this.state = {
            statuses: []
        };

        this.statusStore.onStatusChanged(() => {
            this.setState({statuses: this.statusStore.getStatuses()});
            this.updateFavicon();
        });

        this.updateFavicon();
    }

    updateFavicon() {
        var color = "#5cb85c";
        if (_.find(this.state.statuses, status => status.status === "danger")) {
            color = "#d9534f";
        } else if (_.find(this.state.statuses, status => status.status === "warning")) {
            color = "#f0ad4e";
        } else if (_.find(this.state.statuses, status => status.status === "info")) {
            color = "#5bc0de";
        }

        Piecon.setProgress(100);
        Piecon.setOptions({
            color: color,
            background: "#ffffff"
        });
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