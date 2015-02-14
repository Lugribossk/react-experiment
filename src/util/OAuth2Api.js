import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

export default class OAuth2Api {
    constructor() {
        this.token = null;
    }

    get(url, data) {
        return new Promise((resolve, reject) => {
            var req = request.get(this.getBaseUrl() + url);

            if (this.token) {
                req.set("Authorization", "Bearer " + this.token)
            }
            if (data) {
                req.query(data);
            }

            req.end((err, result) => {
                if (err || result.error) {
                    reject(err || result.error);
                } else {
                    resolve(result.body);
                }
            });
        });
    }

    getAs(url, data, Klass) {
        if (data && !_.isPlainObject(data)) {
            Klass = data;
        }
        return this.get(url, data)
            .then((data) => {
                return new Klass(data);
            });
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            request
                .post(this.getBaseUrl() + url)
                .send(data)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .end((err, result) => {
                    if (err || result.error) {
                        reject(err || result.error);
                    } else {
                        resolve(result.body);
                    }
                });
        });
    }

    getBaseUrl() {
        return "";
    }
}