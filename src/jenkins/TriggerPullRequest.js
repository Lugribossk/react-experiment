import React from "react/addons";
import {Modal, Button, Input} from "react-bootstrap";
import Mixins from "../util/Mixins";
import JobActions from "./job/JobActions";
import BuildUtils from "./build/BuildUtils";

/**
 * Modal for confirming the changelog and starting a pull request build.
 */
export default class TriggerPullRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changelog: this.props.build.getParameters().CHANGELOG || ""
        };
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
            <Modal {...this.props} title="Changelog" bsStyle="success" animation={false}>
                <div className="modal-body">
                    <Input type="textarea" rows="6" valueLink={this.linkState("changelog")} autoFocus/>
                </div>
                <div className="modal-footer">
                    <Button bsStyle="success" onClick={this.onSubmit.bind(this)} disabled={!this.isValid()}>Trigger PR job</Button>
                </div>
            </Modal>
        );
    }
}

Mixins.add(TriggerPullRequest.prototype, [React.addons.LinkedStateMixin, React.addons.PureRenderMixin]);
