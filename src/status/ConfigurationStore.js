import _ from "lodash";
import request from "superagent-bluebird-promise";
import Store from "../flux/Store";
import Logger from "../util/Logger";

var log = new Logger(__filename);

// Register all Source subclasses so they can be instantiated from the configuration.
import AwsRss from "./source/AwsRss";
import DropwizardHealthcheck from "./source/DropwizardHealthcheck";
import Message from "./source/Message";
import StatusCode from "./source/StatusCode";
import StatusIo from "./source/StatusIo";
import TutumService from "./source/TutumService";
var sourceTypes = [AwsRss, DropwizardHealthcheck, Message, StatusCode, StatusIo, TutumService];

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
        var SourceType = _.find(sourceTypes, sourceType => sourceType.type === config.type);
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