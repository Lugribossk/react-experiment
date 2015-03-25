import request from "superagent-bluebird-promise";

var Request = request.Request;

Request.prototype.as = function (Klass) {
    return this.then((data) => {
        return new Klass(data.body);
    });
};

Request.prototype.asList = function (Klass) {
    return this.then((data) => {
        return _.map(data.body, (item) => {
            return new Klass(item);
        });
    });
};

export default class SuperagentApi {
    constructor() {
        this.token = null;
    }

    get(url) {
        return this._authenticateRequest(request.get(this._getBaseUrl() + url));
    }

    post(url) {
        return this._authenticateRequest(request.post(this._getBaseUrl() + url));
    }

    put(url) {
        return this._authenticateRequest(request.put(this._getBaseUrl() + url));
    }

    patch(url) {
        return this._authenticateRequest(request.path(this._getBaseUrl() + url));
    }

    del(url) {
        return this._authenticateRequest(request.del(this._getBaseUrl() + url));
    }

    head(url) {
        return this._authenticateRequest(request.head(this._getBaseUrl() + url));
    }

    setAuthToken(token) {
        this.token = token;
    }

    _authenticateRequest(req) {
        return req;
    }
    
    _getBaseUrl() {
        return "";
    }
}