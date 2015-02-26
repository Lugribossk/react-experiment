import React from "react";
import ReactUpdates from "react/lib/ReactUpdates";
import {Surface} from "react-canvas";
import Sprite from "./Sprite";
import TickStore from "./TickStore";
import PhysicsObjectStore from "./PhysicsObjectStore";

export default class CanvasApp extends React.Component {
    constructor() {
        super();

        this.tickStore = new TickStore();
        this.physStore = new PhysicsObjectStore(this.tickStore);

        this.state = {
            objects: this.physStore.getObjects()
        };

        this.physStore.onUpdate(this.onBlah.bind(this));
    }

    onBlah() {
        this.setState({
            objects: this.physStore.getObjects()
        });
    }

    renderObjects() {
        return _.map(this.state.objects, (obj) => {
            return (
                <Sprite key={obj.id} model={obj} />
            )
        });
    }

    render() {
        return (
            <Surface width={200} height={200} left={0} top={0}>
                {this.renderObjects()}
            </Surface>
        );
    }
}
