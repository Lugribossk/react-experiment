import React from "react";
import _ from "lodash";
import {Col} from "react-bootstrap";
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
            panels: [],
            statuses: []
        };

        this.statusStore.onStatusChanged(() => {
            this.setState({
                panels: this.statusStore.getPanelsWithStatuses(),
                statuses: this.statusStore.getStatuses()
            });
            this.updateFavicon();
        });

        this.updateFavicon();
        AppVersion.reloadImmediatelyOnChange();
    }

    updateFavicon() {
        var color = "#5cb85c";
        if (_.find(this.state.statuses, {status: "danger"})) {
            color = "#d9534f";
        } else if (_.find(this.state.statuses, {status: "warning"})) {
            color = "#f0ad4e";
        } else if (_.find(this.state.statuses, {status: "info"})) {
            color = "#5bc0de";
        }

        Piecon.setProgress(100);
        Piecon.setOptions({
            color: color,
            background: "#ffffff"
        });
    }

    renderPanels() {
        return _.map(this.state.panels, (panel, index) => {
            return (
                <Col key={index} md={12 / this.state.panels.length} className="flex-container">
                    {_.map(panel.statuses, status => <StatusIndicator key={status.title} {...status} />)}
                </Col>
            );
        });
    }

    render() {
        return (
            <div className="full-size">
                {this.renderPanels()}

                <PasswordPrompt configStore={this.configStore} />
            </div>
        );
    }
}

Mixins.add(StatusDashboard.prototype, [React.addons.PureRenderMixin]);