import Store from "../../flux/Store";

export default class BuildsStore extends Store {
    constructor(project, api) {
        super();
        this.project = project;
        this.api = api;

        this.state = {
            builds: []
        };
    }

    _fetchBuilds() {
        this.api.get("/project/" + this.project)
            .then((data) => {
                this.setState({builds: data});
            });
    }

    onBuildsChanged(listener) {
        return this._registerListener("builds", listener);
    }

    getBuilds() {
        return this.state.builds;
    }
}