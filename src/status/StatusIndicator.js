import React from "react/addons";
import _ from "lodash";
import moment from "moment";
import Mixins from "../util/Mixins";
import {Alert, ProgressBar} from "react-bootstrap";

export default class StatusIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: moment()
        };

        this.interval = setInterval(() => this.setState({now: moment()}), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderMessage(message) {
        return (
            <div key={message.name + message.detailName} className="text-center">
                {message.name &&
                    <h4>{message.name} <small>{message.detailName}</small></h4>}
                <p>{message.message}</p>
            </div>
        );
    }

    renderProgress() {
        if (!this.props.progress) {
            return null;
        }

        var percent = this.props.progress.percent(this.state.now);
        var remaining = Math.ceil(this.props.progress.remaining(this.state.now).asMinutes());
        var label = remaining + " minute" + (remaining === 1 ? "" : "s") + " remaining";
        return (
            <ProgressBar now={percent} label={label} />
        );
    }

    render() {
        return (
            <Alert bsStyle={this.props.status} className="flex-item">
                <h1 className="text-center">
                    <a href={this.props.link} target="_blank">
                        {this.props.title}
                    </a>
                </h1>

                {_.map(this.props.messages, message => this.renderMessage(message))}
                {this.renderProgress()}
            </Alert>
        );
    }
}

Mixins.add(StatusIndicator.prototype, [React.addons.PureRenderMixin]);
