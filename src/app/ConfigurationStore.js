import Store from "../flux/Store";

export default class ConfigurationStore extends Store {
    constructor(api) {
        super();
        this.api = api;
        this.state = {
            config: null
        };

        this.update();
    }

    onChange(listener) {
        return this._registerListener("config", listener);
    }

    getConfig() {
        return this.state.config;
    }

    update() {
        this.api.get("/configurations/client")
            .then((config) => {
                this.setState({config: config});
            });
    }
}