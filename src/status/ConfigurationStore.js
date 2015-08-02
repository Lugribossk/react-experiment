import _ from "lodash";
import request from "superagent-bluebird-promise";
import Store from "../flux/Store";
import Logger from "../util/Logger";

var log = new Logger(__filename);

import StatusIo from "./source/StatusIo";
import AwsRss from "./source/AwsRss";
import DropwizardHealthcheck from "./source/DropwizardHealthcheck";
import TutumService from "./source/TutumService";
var sourceTypes = [AwsRss, DropwizardHealthcheck, StatusIo, TutumService];

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
        var source = null;
        _.forEach(sourceTypes, SourceType => {
            if (SourceType.type === config.type) {
                source = new SourceType(config);
            }
        });
        if (!source) {
            log.error("Unknown source type '" + config.type + "'");
        }
        return source;
    }

    _fetchConfig() {
        request.get("config.json")
            .promise()
            .catch(e => {
                log.error("config.json not found, it must be located in the same folder as index.html");
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