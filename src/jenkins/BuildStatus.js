import React from "react";
import {Input, Button, Alert, Glyphicon, Panel} from "react-bootstrap"

var REPOS = {
    Backend: "Backend-Service",
    Supplierintegrations: "Supplier-Integrations",
    Proxy2: "Tradeshift-Proxy2",
    Conversions: "Backend-Conversions",
    Integration: "???",
    Apptool: "App-Tool",
    Appservice: "App-Service",
    Citiscf: "Financing-CitiSCF",
    Cloudscan: "cloudscan-service"
};

export default class BuildStatus extends React.Component {
    getUsername() {
        var username = "";
        _.find(this.props.actions, (action) => {
            if (action.causes && action.causes[0] && action.causes[0].userName) {
                username = action.causes[0].userName;
            }
        });
        return username;
    }

    getLink() {
        return "/job/integration-test-generic-build/" + this.props.id;
    }

    getParameters() {
        var paramList = [];
        _.find(this.props.actions, (action) => {
            if (action.parameters) {
                paramList = action.parameters;
            }
        });
        var params = {};
        _.forEach(paramList, (param) => {
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

    renderHeader() {
        return <a href={this.getLink()} target="_blank">{"#" + this.props.id} - {this.getUsername()}</a>;
    }

    renderBranches() {
        return _.map(this.getRepoBranches(), (branch, repo) => {
            if (branch && branch !== "master") {
                return (
                    <div key={repo}>
                        <a href={"https://github.com/Tradeshift/" + repo + "/tree/" + branch} target="_blank">
                            {repo}: {branch}
                        </a>
                    </div>
                );
            }
        });
    }

    render() {
        var style;
        if (this.props.building) {
            style = "default";
        } else {
            if (this.props.result === "SUCCESS") {
                style = "success"
            } else if (this.props.result === "UNSTABLE") {
                style = "warning"
            } else {
                style = "danger";
            }

        }

        return (
            <Panel bsStyle={style} header={this.renderHeader()}>
                {this.renderBranches()}
            </Panel>
        );
    }
}
