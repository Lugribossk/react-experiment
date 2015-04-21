import React from "react";
import {Alert, Button} from "react-bootstrap";
import Notification from "../../util/browser/Notification.js";

export default class DesktopNotificationPrompt extends React.Component {
    showNotificationPrompt() {
        Notification.requestPermission(() => {
            this.forceUpdate();
        });
    }

    render() {
        if (Notification.permission !== "default") {
            return null;
        }

        return (
            <Alert bsStyle="info">
                <p>
                    Please enable desktop notifications <Button bsStyle="info" bsSize="small" onClick={this.showNotificationPrompt.bind(this)}>Enable</Button>
                </p>
            </Alert>
        );
    }
}
