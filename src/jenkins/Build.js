import React from "react";
import {Input, Button, Alert, Glyphicon, Panel} from "react-bootstrap"

export default
class Build extends React.Component {
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

    getRepoBranches() {
        var params = [];
        _.find(this.props.actions, (action) => {
            if (action.parameters) {
                params = action.parameters;
            }
        });

        var branches = {};
        _.forEach(params, (param) => {
            if (_.endsWith(param.name, "_GIT_REF") && param.value) {
                var repo = param.name.substr(0, param.name.length - 8);
                var branch = _.startsWith(param.value, "origin/") ? param.value.substr(7) : param.value;
                branches[repo] = branch;
            }
        });

        return branches;
    }

    render() {
        var link = <a href={this.getLink()} target="_blank">{"#" + this.props.id} - {this.getUsername()}</a>;

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

        var branches = _.map(this.getRepoBranches(), (branch, repo) => {
            return <div key={repo}>{repo}: {branch}</div>;
        });

        return (
            <Panel bsStyle={style} header={link}>
                {branches}
            </Panel>
        );
    }
}
