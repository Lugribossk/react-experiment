import Ball from "./Ball";
import Store from "../flux/Store";
import _ from "lodash";

export default class PhysicsObjectStore extends Store {
    constructor(tickStore) {
        super();

        this.state = {
            items: [new Ball(0, 0), new Ball(180, 180)]
        };
        tickStore.onTick(this._onTick.bind(this), 1);
    }

    getObjects() {
        return this.state.items;
    }

    onUpdate(listener) {
        return this._registerListener("blah", listener);
    }

    _onTick(elapsed) {
        _.forEach(this.state.items, (item) => {
            item.update(elapsed);
        });
        this._trigger("blah");
    }
}
