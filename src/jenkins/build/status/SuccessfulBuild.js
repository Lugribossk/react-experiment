import React from "react/addons";
import _ from "lodash";
import {ProgressBar, ModalTrigger, Button} from "react-bootstrap"
import TriggerPullRequest from "../../TriggerPullRequest";
import ParameterDetails from "../../ui/ParameterDetails";
import Mixins from "../../../util/Mixins";

export default class SuccessfulBuild extends React.Component {
    render() {
        return (
            <div>
                <ModalTrigger modal={<TriggerPullRequest build={this.props.build}/>}>
                    <Button style={{float: "right"}}>Merge!</Button>
                </ModalTrigger>
                <ProgressBar bsStyle="success" now={100} label={Math.ceil(this.props.build.duration / 60000) + " minutes"}/>
                <ParameterDetails parameters={this.props.build.getParameters()} />
            </div>
        );
    }
}

Mixins.add(SuccessfulBuild.prototype, [React.addons.PureRenderMixin]);