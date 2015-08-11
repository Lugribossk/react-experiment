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
        this.state = this.getCachedState() || {
            sources: [],
            password: null,
            passwordNeeded: false
        };
        this.configFileName = configFileName;

        this._fetchConfig();
    }

    onChanged(listener) {
        return this._registerListener("sources", listener);
    }

    getSources() {
        return this.state.sources;
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

    unmarshalState(data) {
        return {
            config: data.config,
            sources: _.map(data.config.sources, source => this._createSource(source, data.password)),
            password: data.password,
            passwordNeeded: data.passwordNeeded
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

    _fetchConfig() {
        request.get(this.configFileName)
            .promise()
            .catch(e => {
                log.error("Configuration file '" + this.configFileName + "' not found.", e);
                throw e;
            })
            .then(response => {
                var config = JSON.parse(response.text);
                var sources = _.map(config.sources, source => this._createSource(source, this.state.password));
                this.setState({
                    sources: sources,
                    config: config
                });
            })
            .catch(e => log.error("Unable to load configuration", e));
    }
}