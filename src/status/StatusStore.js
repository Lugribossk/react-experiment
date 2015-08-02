import _ from "lodash";
import Promise from "bluebird";
import Store from "../flux/Store";

export default class StatusStore extends Store {
    constructor(configStore) {
        super();
        this.configStore = configStore;
        this.state = {
            sources: this.configStore.getSources(),
            statuses: []
        };

        this.configStore.onSourcesChanged(() => {
            this.setState({
                sources: this.configStore.getSources(),
                statuses: this._createInitialStatuses(this.configStore.getSources())
            });
            this._fetchStatuses();
        });
    }

    onStatusChanged(listener) {
        return this._registerListener("statuses", listener);
    }

    getStatuses() {
        return this.state.statuses;
    }

    _createInitialStatuses(sources) {
        return _.map(sources, source => {
            return {
                title: source.title,
                status: "info",
                messages: [{
                    message: "Waiting for first status..."
                }]
            };
        });
    }

    _fetchStatuses() {
        Promise.all(_.map(this.state.sources, (source, index) => {
            return source.getStatus()
                .then(status => {
                    var statuses = _.slice(this.state.statuses);
                    statuses[index] = status;
                    this.setState({statuses: statuses});
                });
        }));
    }
}