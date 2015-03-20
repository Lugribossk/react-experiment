import React from "react";
import _ from "lodash";
import {ProgressBar, ModalTrigger, Button} from "react-bootstrap"
import Merge from "../Merge";

export default class SuccessfulBuild extends React.Component {
    render() {
        return (
            <div>
                <ModalTrigger modal={<Merge build={this.props.build}/>}>
                    <Button style={{float: "right"}}>Merge!</Button>
                </ModalTrigger>
                <ProgressBar bsStyle="success" now={100} label={Math.ceil(this.props.build.duration / 60000) + " mins"}/>
                {this.props.children}
            </div>
        );
    }
}