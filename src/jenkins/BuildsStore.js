import Store from "../flux/Store"
import request from "superagent";

export default class BuildsStore extends Store {
    constructor() {
        super();

        this.state = {
            builds: []
        };

        this._updateBuilds();

        setInterval(this._updateBuilds.bind(this), 30 * 1000);
    }

    onRecentBuildsChanged(listener) {
        return this._registerListener("builds", listener);
    }

    getRecentBuilds() {
        return this.state.builds;
    }

    _updateBuilds() {
        request.get("/job/integration-test-generic-build/api/json")
            .query("tree=builds[id,building,result,timestamp,duration,actions[parameters[*],causes[userName]]]")
            .end((err, result) => {
                this.setState({builds: result.body.builds});
            });
    }
}
