import Store from "./flux/Store";
import * as Promise from "bluebird";
import {valueOrThrow} from "./future/suspense";

interface State {
    names: Dictionary<Promise<string>>;
}

export default class NameStore extends Store<State> {
    constructor() {
        super();
        this.state = {
            names: {}
        };
    }

    getName(id: string) {
        return valueOrThrow(this.state.names[id]);
    }

    getNames() {
        return valueOrThrow(Promise.all(Object.values(this.state.names)));
    }
}
