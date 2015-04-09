import _ from "lodash";

var ESTIMATED_DURATION_MINS = 30;

var IT_PARAM_REPOS = {
    INTEGRATION_TEST_GIT_REF: "Integration-Test",
    FRONTEND_GIT_REF: "Frontend",
    BACKEND_GIT_REF: "Backend-Service",
    SUPPLIERINTEGRATIONS_GIT_REF: "Supplier-Integrations", // different
    PROXY2_GIT_REF: "Tradeshift-Proxy2",
    CONVERSIONS_GIT_REF: "Backend-Conversions",
    INTEGRATION_GIT_REF: "Integrations",
    APPTOOL_GIT_REF: "App-Tool", // different
    APPSERVICE_GIT_REF: "App-Service", // different
    APPS_GIT_REF: "Apps",
    APPS_SERVER_GIT_REF: "Apps-Server",
    CITISCF_GIT_REF: "Financing-CitiSCF",
    CLOUDSCAN_GIT_REF: "cloudscan-service",
    AUDITSERVER_GIT_REF: "Audit-Server",
    WORKFLOW_GIT_REF: "Workflow",
    FINANCINGDD_GIT_REF: "Financing-DD", // different
    C8_GIT_REF: "Financing-C8",
    BUSINESSEVENTSERVICE_GIT_REF: "BusinessEventHandler",
    LOCKING_GIT_REF: "Locking",
    EMAILINCOMING_GIT_REF: "Email-Incoming-Service",
    CHINAPAYMENT_GIT_REF: "tradeshift-china-payment"
};

var PR_PARAM_REPOS= {
    INTEGRATION_TEST_GIT_REF: "Integration-Test",
    FRONTEND_GIT_REF: "Frontend",
    BACKEND_GIT_REF: "Backend-Service",
    SUPPLIER_INTEGRATIONS_GIT_REF: "Supplier-Integrations",
    PROXY2_GIT_REF: "Tradeshift-Proxy2",
    INTEGRATION_GIT_REF: "Integrations",
    CONVERSIONS_GIT_REF: "Backend-Conversions",
    CLOUDSCAN_GIT_REF: "cloudscan-service",
    APPS_SERVER_GIT_REF: "Apps-Server",
    APPS_GIT_REF: "Apps",
    APPBACKEND_GIT_REF: "App-Service",
    WORKFLOW_GIT_REF: "Workflow",
    CITISCF_GIT_REF: "Financing-CitiSCF",
    DD_GIT_REF: "Financing-DD",
    APP_TOOL_GIT_REF: "App-Tool",
    AUDITSERVER_GIT_REF: "Audit-Server",
    BUSINESSEVENTSERVICE_GIT_REF: "BusinessEventHandler",
    C8_GIT_REF: "Financing-C8",
    LOCKING_GIT_REF: "Locking",
    EMAILINCOMING_GIT_REF: "Email-Incoming-Service"
};

var REPOS = _.values(PR_PARAM_REPOS);

export default {
    estimatePercentComplete(build, now, builds) {
        if (!build.isBuilding()) {
            return 100;
        }
        var estimatedDuration = this.getEstimatedDurationMs(build, builds);
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.min(Math.round(runningFor / estimatedDuration * 100), 100);
    },

    estimateMinutesRemaining(build, now, builds) {
        if (!build.isBuilding()) {
            return 0;
        }
        var estimatedDuration = this.getEstimatedDurationMs(build, builds);
        var started = build.timestamp;
        var runningFor = now - started;

        return Math.ceil((estimatedDuration - runningFor) / 60000);
    },

    getEstimatedDurationMs(runningBuild, builds) {
        if (!builds || builds.length === 0) {
            return ESTIMATED_DURATION_MINS * 60 * 1000;
        }

        var finishedBuilds = _.filter(builds, (build) => {
            return (build.isSuccess() || build.isUnstable()) && build.duration > 5 * 60 * 1000;
        });
        var samePackageBuilds = _.filter(finishedBuilds, (build) => {
            return build.getParameters().PACKAGE_PATH === runningBuild.getParameters().PACKAGE_PATH;
        });

        if (samePackageBuilds.length === 0 && runningBuild.getParameters().PACKAGE_PATH !== "com/tradeshift") {
            samePackageBuilds = finishedBuilds;
        }
        if (samePackageBuilds.length === 0) {
            return ESTIMATED_DURATION_MINS * 60 * 1000;
        }

        var durationSum = _.reduce(samePackageBuilds, (result, build) => {
            return result + build.duration;
        }, 0);
        return Math.ceil(durationSum / samePackageBuilds.length);
    },

    getEstimatedDurationText(build, now, builds) {
        if (!build.isBuilding()) {
            return "Completing...";
        }
        var estimatedDuration = this.getEstimatedDurationMs(build, builds);
        var started = build.timestamp;
        var runningFor = now - started;

        if (estimatedDuration > runningFor) {
            let mins = Math.ceil((estimatedDuration - runningFor) / 60000);
            return mins + " minute" + (mins === 1 ? "" : "s") + " remaining";
        } else {
            let mins = Math.ceil((runningFor - estimatedDuration) / 60000);
            return mins + " minute" + (mins === 1 ? "" : "s") + " overdue";
        }
    },

    getRepoBranches(parameters) {
        var repos = {};
        _.forEach(parameters, (value, name) => {
            if (_.endsWith(name, "_GIT_REF")) {
                var repo = IT_PARAM_REPOS[name];
                var branch = _.startsWith(value, "origin/") ? value.substr(7) : value;

                repos[repo] = branch;
            }
        });

        return repos;
    },

    IT_PARAM_REPOS: IT_PARAM_REPOS,

    PR_PARAM_REPOS:  PR_PARAM_REPOS,

    REPOS: REPOS
}
