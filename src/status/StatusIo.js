import React from "react";
import _ from "lodash";
import {Alert} from "react-bootstrap";

export default class StatusIo extends React.Component {
    renderMessage(message) {
        return (
            <div key={message.name + message.detail}>
                <h4>{message.name} <small>{message.detail}</small></h4>
                <p>{message.status}</p>
            </div>
        );
    }

    render() {
        var bsStyle = "success";
        var messages = [];

        if (this.props.response && this.props.response.body && this.props.response.body.result) {
            var worstStatusCode = 0;
            _.forEach(this.props.response.body.result.status, s => {
                _.forEach(s.containers, c => {
                    if (c.status_code > 100) {
                        messages.push({
                            name: s.name,
                            detailName: c.name,
                            status: c.status
                        });

                        if (c.status_code > worstStatusCode) {
                            worstStatusCode = c.status_code;
                        }
                    }
                });
            });

            // http://kb.status.io/developers/status-codes
            if (worstStatusCode >= 500) {
                bsStyle = "danger";
            } else if (worstStatusCode >= 300) {
                bsStyle = "warning";
            }
        } else {
            bsStyle = "danger";
            messages.push({
                name: "No response from status.io API"
            });
        }

        return (
            <Alert bsStyle={bsStyle}>
                <h3>
                    <a href={this.props.url} target="_blank" style={{color: "inherit"}}>
                        {this.props.title}
                    </a>
                </h3>

                {_.map(messages, message => this.renderMessage(message))}
            </Alert>
        );
    }
}