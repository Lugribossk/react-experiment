import React from "react/addons";
import _ from "lodash";
import {Panel, Button, Modal, ModalTrigger} from "react-bootstrap"
import JobActions from "../job/JobActions";
import Mixins from "../../util/Mixins";

class NewNodeModal extends React.Component {
    spawn() {
        JobActions.triggerSpawnNewInstance("it", this.props.user);
        this.props.onRequestHide();
    }

    render() {
        return (
            <Modal {...this.props} title="Spawn new node?" bsStyle="primary" animation={false}>
                <div className="modal-body">
                    <p>This will create a new instance on Amazon and place it into the pool of Jenkins nodes that run IT subsets.</p>
                    <p>It may take a little while before the new node shows up in the count.</p>
                    <p className="text-danger">Remember that Amazon instances <strong>cost money</strong>.</p>
                </div>
                <div className="modal-footer">
                    <Button bsStyle="primary" onClick={this.spawn.bind(this)}>Spawn</Button>
                </div>
            </Modal>
        );
    }
}

Mixins.add(NewNodeModal.prototype, [React.addons.PureRenderMixin]);

export default class Nodes extends React.Component {
    render() {
        return (
            <div>
                <Panel header="Nodes used for running IT subsets">
                    <p>Busy nodes: {this.props.nodeStore.getNumBusyNodes()}</p>
                    <p>Idle nodes: {this.props.nodeStore.getNumIdleNodes()}</p>

                    <ModalTrigger modal={<NewNodeModal user={this.props.currentUser} />}>
                        <Button bsStyle="primary">Spawn new node</Button>
                    </ModalTrigger>
                </Panel>
            </div>
        );
    }
}

Mixins.add(Nodes.prototype, [React.addons.PureRenderMixin]);