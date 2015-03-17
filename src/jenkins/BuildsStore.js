import Store from "../flux/Store"
import request from "superagent";
import Build from "./Build";

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
            .query("tree=builds[id,building,result,timestamp,duration,actions[parameters[*],causes[userName,upstreamBuild,upstreamProject]]]")
            .end((err, result) => {
                var builds = _.map(result.body.builds, (data) => {
                    return new Build(data);
                });
                this.setState({builds: builds});
            });
    }
}
