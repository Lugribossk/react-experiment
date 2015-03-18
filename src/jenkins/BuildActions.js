import request from "superagent-bluebird-promise";

var PARAM_NAMES = {
    "Backend-Service": "BACKEND",
    "Backend-Conversions": "CONVERSIONS",
    "App-Service": "APPBACKEND",
    "Tradeshift-Proxy2": "PROXY2",
    "Financing-CitiSCF": "CITISCF",
    "Financing-DD": "DD",
    "Financing-C8": "C8",
    BusinessEventHandler: "BUSINESSEVENTSERVICE",
    "cloudscan-service": "CLOUDSCAN",
    "Email-Incoming-Service": "EMAILINCOMING"
};

export default {
    abort: function (build) {
        request.post(build.url + "/stop").end();
    },

    rebuild: function (build) {
        this.trigger(build.getParametersList());
    },

    trigger: function (jobName, parameters) {
        if (_.isObject(parameters)) {
            parameters = _.map(parameters, (value, name) => {
                return {name: name, value: value};
            });
        }

        request.post("/job/" + jobName + "/build") //buildWithParameters?
            .type("form")
            .send({json: JSON.stringify({parameter: parameters})})
            .end();
    },

    triggerPullRequest: function (repoBranches, changelog) {
        var params = {
            CHANGELOG: changelog,
            CHANGELEVEL: "Level 1: (least impact) Functional defect resolution; some performance improvements"
        };

        _.forEach(repoBranches, (branch, repo) => {
            var repoName = PARAM_NAMES[repo] || repo.toLocaleUpperCase().replace(/-/g, "_");
            params[repoName + "_GIT_REF"] = "origin/" + branch;
        });

        this.trigger("pull-request", params);
    }
}
