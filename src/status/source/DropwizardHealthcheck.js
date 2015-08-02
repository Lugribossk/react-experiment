import _ from "lodash";
import request from "superagent-bluebird-promise";

// Cross-Origin-Resource-Sharing must be set up for the healthcheck endpoint
export default class DropwizardHealthCheck {
    constructor(title, hostname) {
        this.title = title;
        this.hostname = hostname;
    }

    getRequest() {
        return request.get(this.hostname + "/admin/healthcheck")
            .promise()
            .catch(e => e);
    }

    getStatus() {
        return this.getRequest().then(response => {
            var status = "success";
            var messages = [];

            if (!response || !response.body) {
                status = "danger";
                messages.push({
                    message: "No response from healthcheck"
                });
            } else {
                _.forEach(response.body, (data, name) => {
                    if (_.isBoolean(data.healthy) && data.healthy) {
                        return;
                    }

                    status = "danger";
                    messages.push({
                        name: name,
                        message: data.message || (data.error && data.error.stack && data.error.stack[0])
                    });
                });
            }

            return {
                title: this.title,
                link: this.hostname + "/admin/healthcheck?pretty=true",
                status: status,
                messages: messages
            };
        });
    }
}