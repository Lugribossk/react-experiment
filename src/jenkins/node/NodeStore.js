import request from "superagent-bluebird-promise";
import Store from "../../flux/Store";

export default class NodeStore extends Store {
    constructor(label) {
        super();
        this.label = label;
        this.state = {
            busy: 0,
            idle: 0,
            total: 0
        };

        this._updateNodes();
        setInterval(this._updateNodes.bind(this), 30 * 1000);
    }

    onNodeCountChanged(listener) {
        return this._registerListener("count", listener);
    }

    getNumBusyNodes() {
        return this.state.busy;
    }

    getNumIdleNodes() {
        return this.state.idle;
    }

    getNumTotalNodes() {
        return this.state.total;
    }

    _updateNodes() {
        request.get("/label/" + this.label + "/api/json")
            .query("tree=busyExecutors,idleExecutors,totalExecutors")
            .then((result) => {
                this.setState({
                    busy: result.body.busyExecutors,
                    idle: result.body.idleExecutors,
                    total: result.body.totalExecutors
                });
                this._trigger("count");
            });
    }
}