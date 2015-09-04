import _ from "lodash";
import request from "superagent-bluebird-promise";
import Source from "./Source";

request.Request.prototype.jsonp = function (name = "callback") {
    this.callbackQueryName = name;
    this.callbackFunctionName = "superagentCallback" + new Date().valueOf() + _.parseInt(Math.random() * 1000);
    window[this.callbackFunctionName] = data => {
        delete window[this.callbackFunctionName];
        document.getElementsByTagName("head")[0].removeChild(this.scriptElement);

        this.callback.apply(this, [null, {body: data}]);
    };
    return this;
};

var oldEnd = request.Request.prototype.end;
request.Request.prototype.end = function (callback) {
    if (!this.callbackFunctionName) {
        return oldEnd.call(this, callback);
    }

    this.callback = callback;
    this.query({[this.callbackQueryName]: this.callbackFunctionName});

    var queryString = request.serializeObject(this._query.join("&"));
    var url = this.url + (_.contains(this.url, "?") ? "&" : "?") + queryString;

    this.scriptElement = document.createElement("script");
    this.scriptElement.src = url;
    document.getElementsByTagName("head")[0].appendChild(this.scriptElement);

    return this;
};

export default class AwsRss extends Source {
    constructor(data) {
        super(data);
        this.id = data.id;
        this.interval = data.interval || 600;
    }

    getRequest() {
        return request.get("http://ajax.googleapis.com/ajax/services/feed/load")
            .query({
                v: "1.0",
                q: "http://status.aws.amazon.com/rss/" + this.id + ".rss"
            })
            .jsonp("callback")
            .promise();
    }

    getStatus() {
        return this.getRequest().then(response => {
            var status;
            var message = "";

            if (!response || !response.body) {
                status = "danger";
                message = "No response from status feed";
            } else {
                var latestEntry = response.body.responseData.feed.entries[0];

                if (_.contains(latestEntry.title, "Service is operating normally") ||
                    _.contains(latestEntry.content, "service is operating normally")) {
                    status = "success";
                } else {
                    if (_.contains(latestEntry.title, "Informational message")) {
                        status = "warning";
                    } else {
                        status = "danger";
                    }
                    message = latestEntry.content;
                }
            }

            return {
                title: this.title,
                link: "http://status.aws.amazon.com/",
                status: status,
                messages: [{
                    message: message
                }]
            };
        });
    }
}

AwsRss.type = "aws";