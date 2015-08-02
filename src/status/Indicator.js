import React from "react";
import _ from "lodash";
import {Alert} from "react-bootstrap";

export default class Indicator extends React.Component {
    renderMessage(message) {
        return (
            <div key={message.name + message.detailName}>
                {message.name &&
                    <h4>{message.name} <small>{message.detailName}</small></h4>}
                <p>{message.message}</p>
            </div>
        );
    }

    render() {
        return (
            <Alert bsStyle={this.props.status}>
                <h3>
                    <a href={this.props.link} target="_blank" style={{color: "inherit"}}>
                        {this.props.title}
                    </a>
                </h3>

                {_.map(this.props.messages, message => this.renderMessage(message))}
            </Alert>
        );
    }
}