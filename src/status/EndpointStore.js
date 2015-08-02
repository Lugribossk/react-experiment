import _ from "lodash";
import Store from "../flux/Store";

export default class EndpointStore extends Store {
    constructor(sources) {
        super();
        this.sources = sources;
        this.state = {};

        this._update();
    }

    onResponse(listener) {
        return this._registerListener("response", listener);
    }

    getResponses() {
        return this.state;
    }

    _update() {
        _.forEach(this.sources, source => {
            source.getStatus()
                .then(data => {
                    this.setState({[data.title]: data});
                    this._trigger("response");
                });
        });
    }
}