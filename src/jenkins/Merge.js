import React from "react/addons";
import {Modal, Button, Input} from "react-bootstrap"
import Mixins from "../util/Mixins";
import JobActions from "./job/JobActions";
import BuildUtils from "./build/BuildUtils";

export default class Merge extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changelog: this.props.build.getParameters().CHANGELOG || ""
        } ;
    }

    isValid() {
        return this.state.changelog.length > 5;
    }

    onSubmit() {
        if (!this.isValid()) {
            return;
        }

        JobActions.triggerPullRequest(BuildUtils.getRepoBranches(this.props.build.getParameters()), this.state.changelog);
        this.props.onRequestHide();
    }

    render() {
        return (
            <Modal {...this.props} title="Changelog" animation={false}>
                <div className="modal-body">
                    <Input type="textarea" valueLink={this.linkState("changelog")} autoFocus/>
                </div>
                <div className="modal-footer">
                    <Button bsStyle="success" onClick={this.onSubmit.bind(this)} disabled={!this.isValid()}>Trigger PR job</Button>
                </div>
            </Modal>
        );
    }
}

Mixins.add(Merge.prototype, [React.addons.LinkedStateMixin]);
