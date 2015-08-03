import _ from "lodash";
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

        this.intervals = [];
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
        _.forEach(this.intervals, interval => window.clearInterval(interval));
        this.intervals = [];

        _.forEach(this.state.sources, (source, index) => {
            var getSourceStatus = () => {
                return source.getStatus()
                    .then(status => {
                        var statuses = _.slice(this.state.statuses);
                        statuses[index] = status;
                        this.setState({statuses: statuses});
                    });
            };

            this.intervals.push(window.setInterval(getSourceStatus, source.getInterval() * 1000));

            getSourceStatus();
        });
    }
}