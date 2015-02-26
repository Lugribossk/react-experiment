import React from "react";
import ReactUpdates from "react/lib/ReactUpdates";
import {Surface} from "react-canvas";
import Ball from "./Ball";
import TickStore from "./TickStore";

export default class CanvasApp extends React.Component {
    constructor() {
        super();

        var tickStore = new TickStore();
    }

    render() {
        return (
            <Surface width={200} height={200} left={0} top={0}>
                <Ball />
            </Surface>
        );
    }
}