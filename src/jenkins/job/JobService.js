import request from "superagent-bluebird-promise";
import moment from "moment";
import JobActions from "./JobActions";

var PR_PARAM_REPOS= {
    INTEGRATION_TEST_GIT_REF: "Integration-Test",
    FRONTEND_GIT_REF: "Frontend",
    BACKEND_GIT_REF: "Backend-Service",
    SUPPLIER_INTEGRATIONS_GIT_REF: "Supplier-Integrations",
    PROXY2_GIT_REF: "Tradeshift-Proxy2",
    INTEGRATION_GIT_REF: "Integrations",
    CONVERSIONS_GIT_REF: "Backend-Conversions",
    CLOUDSCAN_GIT_REF: "cloudscan-service",
    APP_TOOL_GIT_REF: "App-Tool",
    APPS_GIT_REF: "Apps",
    APPBACKEND_GIT_REF: "App-Service",
    CITISCF_GIT_REF: "Financing-CitiSCF",
    DD_GIT_REF: "Financing-DD",
    AUDITSERVER_GIT_REF: "Audit-Server",
    WORKFLOW_GIT_REF: "Workflow",
    BUSINESSEVENTSERVICE_GIT_REF: "BusinessEventHandler",
    C8_GIT_REF: "Financing-C8",
    APPS_SERVER_GIT_REF: "Apps-Server",
    LOCKING_GIT_REF: "Locking",
    EMAILINCOMING_GIT_REF: "Email-Incoming-Service"
};

export default class JobService {
    constructor() {
        JobActions.trigger.onDispatch(this.trigger.bind(this));
        JobActions.triggerPullRequest.onDispatch(this.triggerPullRequest.bind(this));
        JobActions.unkeepBuilds.onDispatch(this.unkeepBuilds.bind(this));
    }

    trigger(jobName, parameters) {
        var paramList = _.map(parameters, (value, name) => {
            return {name: name, value: value};
        });

        request.post("/job/" + jobName + "/build") //buildWithParameters?
            .type("form")
            .send({json: JSON.stringify({parameter: paramList})})
            .end();
    }

    triggerPullRequest(repoBranches, changelog) {
        var params = {
            CHANGELOG: changelog,
            CHANGELEVEL: "Level 1: (least impact) Functional defect resolution; some performance improvements",
            AUTO_TEST_COVERAGE: false,
            CROSS_BROWSER_TESTED: false
        };

        _.forEach(PR_PARAM_REPOS, (repo, param) => {
            var branch = repoBranches[repo];
            params[param] = "origin/" + (branch || "master");
        });

        this.trigger("pull-request", params);
    }

    unkeepBuilds(jobName, olderThan) {
        request.get("/job/" + jobName + "/api/json")
            .query("tree=builds[number,timestamp,keepLog]{0,100}")
            .then((data) => {
                _.forEach(data.body.builds, (build) => {
                    if (build.keepLog && build.timestamp && moment(build.timestamp, "x").isBefore(olderThan)) {
                        request.get("/job/" + jobName + "/" + build.number + "/toggleLogKeep")
                            .query("json={}")
                            .end();
                    }
                });
            });
    }
}