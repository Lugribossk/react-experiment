import React from "react";
import {Image} from "react-canvas";
import ball from "./ball.png";

export default class Ball extends React.Component {
    constructor() {
        //var x = this.props.model;
        this.state = {
            top: 0,//x.top,
            left: 0//x.left
        };

        //this.subscribe(x.onBlah(this.onBlah.bind(this)));
    }

    onBlah() {
        this.setState({
            top: this.props.model.top,
            left: this.props.model.left
        });
    }

    render() {
        return (
            <Image style={{top: this.state.top, left: this.state.left, width: 20, height: 20}} src={ball} />
        );
    }
}