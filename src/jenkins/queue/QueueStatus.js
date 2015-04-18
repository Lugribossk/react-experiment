import React from "react/addons";
import {Panel, Button} from "react-bootstrap";
import ParameterDetails from "../ui/ParameterDetails";
import QueueActions from "./QueueActions";
import Mixins from "../../util/Mixins";

export default class QueueStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aborted: false
        };
    }

    abort() {
        this.setState({aborted: true});
        QueueActions.abort(this.props.item.id);
    }

    renderHeader() {
        return (
            <span>
                <span>
                    Queued - {this.props.item.getUserFullName() || "Unknown"}
                </span>
            </span>
        );
    }

    render() {
        return (
            <Panel header={this.renderHeader()}>
                <Button onClick={this.abort.bind(this)} style={{float: "right"}} title="Abort queued build" disabled={this.state.aborted}>
                    {this.state.aborted ? "Aborted" : "Abort"}
                </Button>
                <ParameterDetails parameters={this.props.item.getParameters()} />
            </Panel>
        );
    }
}

Mixins.add(QueueStatus.prototype, [React.addons.PureRenderMixin]);