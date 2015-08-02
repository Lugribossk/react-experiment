import _ from "lodash";
import request from "superagent-bluebird-promise";
import Store from "../flux/Store";
import Logger from "../util/Logger";
import Message from "./source/Message";
import SOURCE_TYPES from "./source/SourceTypes";

var log = new Logger(__filename);

export default class ConfigurationStore extends Store {
    constructor() {
        super();
        this.state = {
            sources: []
        };

        this._fetchConfig();
    }

    getSources() {
        return this.state.sources;
    }

    onSourcesChanged(listener) {
        return this._registerListener("sources", listener);
    }

    _createSource(config) {
        var SourceType = _.findWhere(SOURCE_TYPES, {type: config.type});
        if (!SourceType) {
            var err = "Unknown source type '" + config.type + "' in configuration.";
            log.error(err);
            return new Message({
                title: config.title,
                status: "warning",
                message: err
            });
        }
        return new SourceType(config);
    }

    _fetchConfig() {
        request.get("config.json")
            .promise()
            .catch(e => {
                log.error("config.json not found, it must be located in the same folder as index.html.", e);
                throw e;
            })
            .then(response => {
                var config = JSON.parse(response.text);
                var sources = _.map(config.sources, source => this._createSource(source));
                this.setState({sources: sources});
            })
            .catch(e => log.error("Unable to load configuration", e));
    }
}