import _ from "lodash";

var REPOS = {
    Backend: "Backend-Service",
    Supplierintegrations: "Supplier-Integrations",
    Proxy2: "Tradeshift-Proxy2",
    Conversions: "Backend-Conversions",
    Apptool: "App-Tool",
    Appservice: "App-Service",
    Citiscf: "Financing-CitiSCF",
    Cloudscan: "cloudscan-service"
};

export default class Build {
    constructor(data) {
        _.assign(this, data);
    }

    isSuccess() {
        return this.result === "SUCCESS";
    }

    isUnstable() {
        return this.result === "UNSTABLE";
    }

    isFailed() {
        return this.result === "FAILED" || this.result === "FAILURE";
    }

    isAborted() {
        return this.result === "ABORTED";
    }

    getUpstream() {
        var data = {};
        _.forEach(this.actions, (action) => {
            if (action.causes &&
                action.causes[0] &&
                action.causes[0].upstreamBuild) {
                data = {
                    id: action.causes[0].upstreamBuild,
                    name: action.causes[0].upstreamProject
                }
            }
        });
        return data;
    }

    getUsername() {
        var username = "";
        _.find(this.actions, (action) => {
            if (action.causes && action.causes[0] && action.causes[0].userName) {
                username = action.causes[0].userName;
                return true;
            }
        });
        return username;
    }

    getParametersList() {
        var paramList = [];
        _.find(this.actions, (action) => {
            if (action.parameters) {
                paramList = action.parameters;
                return true;
            }
        });
        return paramList;
    }

    getParameters() {
        var params = {};
        _.forEach(this.getParametersList(), (param) => {
            params[param.name] = param.value;
        });
        return params;
    }

    getRepoBranches() {
        var repos = {};
        _.forEach(this.getParameters(), (value, name) => {
            if (_.endsWith(name, "_GIT_REF")) {
                var rawRepo = name.substr(0, name.length - 8);
                rawRepo = _.startCase(rawRepo.toLocaleLowerCase()).replace(" ", "-");
                var realRepo = REPOS[rawRepo] || rawRepo;
                var branch = _.startsWith(value, "origin/") ? value.substr(7) : value;

                repos[realRepo] = branch;
            }
        });

        return repos;
    }
}
