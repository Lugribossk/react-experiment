import React from "react/addons";
import _ from "lodash";
import {Modal, Button, Input} from "react-bootstrap"
import Mixins from "../util/Mixins";
import JobActions from "./job/JobActions";
import BuildUtils from "./build/BuildUtils";

var importantRepos = ["Integration-Test", "Frontend", "Backend-Service", "Apps", "App-Service", "Apps-Server", "Backend-Conversions"];

/**
 * Modal for setting parameters and triggering a integration test build.
 */
export default class TriggerIntegrationTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changelog: this.props.changelog || "",
            packagePath: this.props.packagePath || "",
            showAll: false
        };
        _.forEach(BuildUtils.REPOS, (repo) => {
            if (this.props.repoBranches && this.props.repoBranches[repo] !== "master") {
                this.state[repo] = this.props.repoBranches[repo];

                if (!_.contains(importantRepos, repo)) {
                    this.state.showAll = true;
                }
            } else {
                this.state[repo] = "";
            }
        });
    }

    getInputStyling() {
        return {
            labelClassName: "col-xs-4",
            wrapperClassName: "col-xs-8"
        };
    }

    isValid() {
        return true;
    }

    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValid()) {
            return;
        }

        var branches = {};
        _.forEach(this.state, (value, key) => {
            if (_.contains(BuildUtils.REPOS, key)) {
                branches[key] = value;
            }
        });

        JobActions.triggerIntegrationTest(branches, this.state.changelog, this.state.packagePath || "com/tradeshift");
        this.props.onRequestHide();
    }

    renderBranches() {
        var important = _.map(_.sortBy(importantRepos), (repo) => {
            return <Input key={repo} type="text" label={repo} placeholder="master" valueLink={this.linkState(repo)} {...this.getInputStyling()} />;
        });
        var rest = _.map(_.sortBy(BuildUtils.REPOS), (repo) => {
            if (!_.contains(importantRepos, repo)) {
                var label = <span style={{fontWeight: "normal"}}>{repo}</span>;

                return <Input key={repo} type="text" label={label} placeholder="master" valueLink={this.linkState(repo)} {...this.getInputStyling()} />;
            }
        });

        return (
            <div >
                {important}
                {this.state.showAll && rest}
            </div>
        );
    }

    render() {
        return (
            <Modal {...this.props} bsStyle="primary" title="Start new IT run" animation={false}>
                <div className="modal-body">
                    <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                        <Input key="changelog" rows="6" type="textarea" label="Changelog" autoFocus valueLink={this.linkState("changelog")} {...this.getInputStyling()} />
                        {this.renderBranches()}
                        <Input key="package" type="text" label="Run tests in package" placeholder="com/tradeshift" valueLink={this.linkState("packagePath")} {...this.getInputStyling()} />
                    </form>
                </div>
                <div className="modal-footer">
                    {!this.state.showAll &&
                        <Button onClick={() => {
                            this.setState({showAll: true});
                        }}>Show all options</Button>}
                    <Button bsStyle="primary" onClick={this.onSubmit.bind(this)} disabled={!this.isValid()}>Start!</Button>
                </div>
            </Modal>
        );
    }
}

Mixins.add(TriggerIntegrationTest.prototype, [React.addons.LinkedStateMixin]);
