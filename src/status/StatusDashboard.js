import React from "react";
import _ from "lodash";
import Piecon from "piecon";
import Mixins from "../util/Mixins";
import ConfigurationStore from "./ConfigurationStore";
import StatusStore from "./StatusStore";
import StatusIndicator from "./StatusIndicator";
import UrlParameters from "../util/UrlParameters";
import AppVersion from "../util/AppVersion";
import PasswordPrompt from "./PasswordPrompt";

export default class StatusDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.configStore = new ConfigurationStore(UrlParameters.fromQuery().config);
        this.statusStore = new StatusStore(this.configStore);

        this.state = {
            statuses: []
        };

        this.statusStore.onStatusChanged(() => {
            this.setState({statuses: this.statusStore.getStatuses()});
            this.updateFavicon();
        });

        this.updateFavicon();
        AppVersion.reloadImmediatelyOnChange();
    }

    updateFavicon() {
        var color = "#5cb85c";
        if (_.findWhere(this.state.statuses, {status: "danger"})) {
            color = "#d9534f";
        } else if (_.findWhere(this.state.statuses, {status: "warning"})) {
            color = "#f0ad4e";
        } else if (_.findWhere(this.state.statuses, {status: "info"})) {
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
            <div className="flex-container">
                {_.map(this.state.statuses, status => <StatusIndicator key={status.title} {...status} />)}

                <PasswordPrompt configStore={this.configStore} />
            </div>
        );
    }
}

Mixins.add(StatusDashboard.prototype, [React.addons.PureRenderMixin]);