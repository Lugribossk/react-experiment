import React from "react";
import {Image} from "react-canvas";
import ball from "./ball.png";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";

export default class Sprite extends React.Component {
    render() {
        var style = {top: this.props.model.top, left: this.props.model.left, width: 20, height: 20};
        return (
            <Image style={style} src={this.props.model.getImage()} />
        );
    }
}
