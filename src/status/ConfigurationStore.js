import _ from "lodash";
import sjcl from "sjcl";
import request from "superagent-bluebird-promise";
import CachingStore from "../flux/CachingStore";
import Logger from "../util/Logger";
import Message from "./source/Message";
import SOURCE_TYPES from "./source/SourceTypes";

var log = new Logger(__filename);

window.encrypt = (password, data) => {
    log.info("Encrypted value:", JSON.stringify(sjcl.encrypt(password, data)));
};

export default class ConfigurationStore extends CachingStore {
    constructor(configFileName = "config.json") {
        super(__filename);
        this.state = _.defaults(this.getCachedState(), {
            sources: [],
            panels: {},
            password: null,
            passwordNeeded: false
        });
        this.configFileName = configFileName;

        this._fetchConfig();
    }

    onChanged(listener) {
        return this._registerListener("sources", listener);
    }

    getSources() {
        return this.state.sources;
    }

    getPanels() {
        return this.state.panels;
    }

    getPassword() {
        return this.state.password;
    }

    isPasswordNeeded() {
        return this.state.passwordNeeded;
    }

    setPassword(newPass) {
        this.setState({password: newPass});
        this.saveToLocalStorage();
        this._fetchConfig();
    }

    decrypt(data, password) {
        if (_.isString(data)) {
            return data;
        }
        if (!password) {
            this.setState({passwordNeeded: true});
            this._trigger("sources");
            return null;
        }

        try {
            return sjcl.decrypt(password, data.encrypted);
        } catch (e) {
            this.setState({
                password: null,
                passwordNeeded: true
            });
            log.error("Password incorrect.", e);
            return null;
        }
    }

    marshalState() {
        return {
            password: this.state.password
        };
    }

    unmarshalState(data) {
        return {
            password: data.password
        };
    }

    _createSource(config, password) {
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
        return new SourceType(config, {
            decrypt: blah => this.decrypt(blah, password)
        });
    }

    _parseConfig(config) {
        var panels = {};
        var sources = [];

        var createPanel = (panel, index) => {
            if (!panels[index]) {
                panels[index] = {
                    title: panel.title,
                    sources: []
                };
            }

            _.forEach(panel.sources, sourceConfig => {
                var source = this._createSource(sourceConfig, this.state.password);
                sources.push(source);

                panels[index].sources.push(source);
            });
        };

        if (config.panels) {
            _.forEach(config.panels, createPanel);

            if (config.sources) {
                log.warn("Both 'panels' and 'sources' were specified at top levle in configuration, ignoring 'sources'.");
            }
        } else {
            createPanel(config, 0);
        }

        this.setState({
            sources: sources,
            panels: panels
        });
    }

    _fetchConfig() {
        return request.get(this.configFileName)
            .promise()
            .catch(e => {
                log.error("Configuration file '" + this.configFileName + "' not found.", e);
                throw e;
            })
            .then(response => {
                var config = JSON.parse(response.text);
                this._parseConfig(config);
            })
            .catch(e => log.error("Unable to load configuration", e));
    }
}