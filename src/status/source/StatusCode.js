import request from "superagent-bluebird-promise";
import Source from "./Source";

export default class StatusCode extends Source {
    constructor(data) {
        super(data);
        this.url = data.url;
        this.link = data.link || data.url;
    }

    getRequest() {
        return request.get(this.url)
            .promise()
            .catch(e => e);
    }

    getStatus() {
        return this.getRequest()
            .then(() => {
                return {
                    title: this.title,
                    link: this.link,
                    status: "success",
                    messages: []
                };
            })
            .catch(response => {
                return {
                    title: this.title,
                    link: this.link,
                    status: "danger",
                    messages: [{
                        message: "Response had status code " + response.status
                    }]
                };
            });
    }
}

StatusCode.type = "status-code";