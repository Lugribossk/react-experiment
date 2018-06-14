import Store from "./flux/Store";
import * as Promise from "bluebird";

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

    }

    getNames() {

    }
}
