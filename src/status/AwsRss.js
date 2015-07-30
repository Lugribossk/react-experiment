import React from "react";
import _ from "lodash";
import {Alert} from "react-bootstrap";

export default class AwsRss extends React.Component {
    render() {
        var bsStyle = "success";
        var message = "";

        if (this.props.response && this.props.response.body) {
            var latestEntry = this.props.response.body.responseData.feed.entries[0];

            if (!_.contains(latestEntry.title, "Service is operating normally") &&
                !_.contains(latestEntry.content, "service is operating normally")) {

                if (_.contains(latestEntry.title, "Informational message")) {
                    bsStyle = "warning";
                } else {
                    bsStyle = "danger";
                }
                message = latestEntry.content;
            }
        } else {
            bsStyle = "danger";
            message = "No response from status feed";
        }

        return (
            <Alert bsStyle={bsStyle}>
                <h3>
                    <a href="http://status.aws.amazon.com/" target="_blank" style={{color: "inherit"}}>
                        {this.props.title}
                    </a>
                </h3>
                {message}
            </Alert>
        );
    }
}