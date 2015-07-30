import _ from "lodash";
import request from "superagent-bluebird-promise";
import Store from "../flux/Store";

request.Request.prototype.jsonp = function (name = "callback") {
    this.callbackQueryName = name;
    this.callbackFunctionName = "superagentCallback" + new Date().valueOf() + parseInt(Math.random() * 1000);
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


export default class EndpointStore extends Store {
    constructor(endpoints) {
        super();
        this.endpoints = endpoints;
        this.state = {};

        this._update();
    }

    onResponse(listener) {
        return this._registerListener("response", listener);
    }

    getResponse(config) {
        return this.state[config.url || config.rss];
    }

    _update() {
        _.forEach(this.endpoints, config => {
            var req;
            if (config.rss) {
                req = request.get("http://ajax.googleapis.com/ajax/services/feed/load")
                    .query({
                        v: "1.0",
                        q: config.rss
                    })
                    .jsonp("callback");
            } else {
                req = request.get(config.url);
            }

            if (config.auth) {
                req = config.auth(req);
            }
            req.then(response => {
                this.setState({[config.url || config.rss]: response});
            })
            .catch(error => {
                this.setState({[config.url || config.rss]: error});
            })
            .finally(() => this._trigger("response"));
        });
    }
}