import React from "react/addons";
import _ from "lodash";
import {Modal, Button, Input} from "react-bootstrap"
import Mixins from "../util/Mixins";
import JobActions from "./job/JobActions";
import BuildUtils from "./build/BuildUtils";

export default class TriggerIntegrationTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changelog: "",
            packagePath: ""
        };
        _.forEach(BuildUtils.REPOS, (repo) => {
            this.state[repo] = "";
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
        return _.map(BuildUtils.REPOS, (repo) => {
            return <Input key={repo} type="text" label={repo} placeholder="master" valueLink={this.linkState(repo)} {...this.getInputStyling()} />
        });
    }

    render() {
        return (
            <Modal {...this.props} bsStyle="primary" title="Start new IT run" animation={false}>
                <div className="modal-body">
                    <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                        {this.renderBranches()}
                        <hr/>
                        <Input key="changelog" type="textarea" label="Changelog" valueLink={this.linkState("changelog")} {...this.getInputStyling()} />
                        <Input key="package" type="text" label="Run tests in package" placeholder="com/tradeshift" valueLink={this.linkState("packagePath")} {...this.getInputStyling()} />
                    </form>
                </div>
                <div className="modal-footer">
                    <Button bsStyle="primary" onClick={this.onSubmit.bind(this)} disabled={!this.isValid()}>Start!</Button>
                </div>
            </Modal>
        );
    }
}

Mixins.add(TriggerIntegrationTest.prototype, [React.addons.LinkedStateMixin]);
