import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

export default class OAuth2Api {
    constructor() {
        this.token = null;
    }

    get(url, data) {
        return new Promise((resolve) => {
            var req = request.get(this.getBaseUrl() + url);

            if (this.token) {
                req.set("Authorization", "Bearer " + this.token)
            }
            if (data) {
                req.query(data);
            }

            req.end((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.body);
                }
            });
        });
    }

    post(url, data) {
        return new Promise((resolve) => {
            request
                .post(this.getBaseUrl() + url)
                .send(data)
                .set("Content-Type", "application/x-www-form-urlencoded")
                .end((err, result) => {
                    if (err) {
                        reject(err);
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