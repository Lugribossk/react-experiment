import _ from "lodash";
import {OrderedMap} from "immutable";
import Store from "../flux/Store";
import Logger from "../util/Logger";

var log = new Logger(__filename);

export default class StatusStore extends Store {
    constructor(configStore) {
        super();
        this.configStore = configStore;
        this.intervals = [];
        this.state = {
            sources: this.configStore.getSources(),
            statuses: new OrderedMap()
        };

        this.configStore.onChanged(() => {
            this.setState({
                sources: this.configStore.getSources(),
                statuses: this._createInitialStatuses(this.configStore.getSources())
            });
            this._setupStatusFetching();
        });
    }

    onStatusChanged(listener) {
        return this._registerListener("statuses", listener);
    }

    getStatuses() {
        return _.flatten(this.state.statuses.toArray());
    }

    _createInitialStatuses(sources) {
        return new OrderedMap().withMutations(map => {
            _.forEach(sources, source => {
                map.set(source, [{
                    title: source.title,
                    status: "info",
                    messages: [{
                        message: "Waiting for first status..."
                    }]
                }]);
            });
        });
    }

    _setupStatusFetching() {
        _.forEach(this.intervals, interval => window.clearInterval(interval));
        this.intervals = [];

        _.forEach(this.state.sources, source => {
            var fetchStatus = () => {
                return source.getStatus()
                    .timeout(10000)
                    .catch(e => {
                        log.error("Error while getting status:", e);
                        return {
                            title: source.title,
                            status: "danger",
                            messages: [{
                                message: "Unable to determine status"
                            }]
                        };
                    })
                    .then(status => {
                        if (!this.state.statuses.get(source)) {
                            // This must have been in progress when the source was removed.
                            return;
                        }
                        if (!_.isArray(status)) {
                            status = [status];
                        }

                        this.setState({statuses: this.state.statuses.set(source, status)});
                    });
            };

            this.intervals.push(window.setInterval(fetchStatus, source.getInterval() * 1000));
            fetchStatus();
        });
    }
}