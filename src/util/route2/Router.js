import _ from "lodash";

var singleton;

/**
 * Hash fragment navigation router for the Route component.
 */
export default class Router {
    /**
     * @param {Window} [win]
     */
    constructor(win) {
        this.listeners = [];
        this.extractors = [];
        this.hash = "";
        this.parameters = {};
        this.window = win || window;

        this.window.addEventListener("hashchange", this.whenHashChange.bind(this));
        this.whenHashChange({newURL: this.window.location.href});

        singleton = this;
    }

    register(listener, path, defaultPath=false) {
        this.listeners.push(listener);

        var extractor = Router.createExtractor(path);
        this.extractors.push(extractor);

        if (defaultPath) {
            if (this.defaultPath) {
                throw new Error("Multiple default paths!");
            }
            this.defaultPath = path;
        }

        if (this.notFound) {
            this.whenHashChange({newURL: this.window.location.href});
        }

        return () => {
            _.remove(this.listeners, (el) => {
                return el === listener;
            });
            _.remove(this.extractors, (el) => {
                return el === extractor;
            });
            if (defaultPath) {
                this.defaultPath = null;
            }
        }
    }

    getParameters() {
        return this.parameters;
    }

    getRoute() {
        return this.hash;
    }

    currentRouteMatches(path) {
        if (_.contains(path, ":")) {
            path = path.substr(0, path.indexOf(":"));
        }

        var isDefault = (this.hash === "" && path === "#");
        var isSubpath = (this.hash.indexOf(path) === 0);

        return isDefault || isSubpath;
    }

    whenHashChange(event) {
        this.hash = event.newURL.split("#")[1] || "";
        this.notFound = false;

        var parameters;
        _.find(this.extractors, (extractor) => {
            parameters = extractor(this.hash);
            return !!parameters;
        });

        if (parameters) {
            this.parameters = parameters;
            _.forEach(this.listeners, (listener) => {
                listener();
            });
            return;
        }

        if (this.defaultPath) {
            this.window.location.hash = this.defaultPath + " ";
            return;
        }

        this.notFound = true;
    }

    static createExtractor(path) {
        var parameterNames = Router._getMatches(/:(\w+)(?:\/|$)/g, path);
        var matchAndExtract = new RegExp("^" + path.replace(/\\/g, "\\/").replace(/(:\w+)/g, "(\\w+)") + "$");

        return (possiblePath) => {
            var match = possiblePath.match(matchAndExtract);
            if (!match) {
                return null;
            }

            var parameters = {};
            for (var i = 0; i < parameterNames.length; i++) {
                var name = parameterNames[i];
                var value = match[i + 1];
                parameters[name] = value;
            }

            return parameters;
        }
    }

    static _getMatches(regex, text) {
        if (!regex.global) {
            throw new Error("Regex must have global flag set");
        }
        var match;
        var out = [];
        while ((match = regex.exec(text)) !== null) {
            out.push(match[1]);
        }
        return out;
    }

    static register(...args) {
        return singleton.register(...args);
    }

    static getCurrentParameters(...args) {
        return singleton.getCurrentParameters(...args);
    }

    static currentRouteMatches(...args) {
        return singleton.currentRouteMatches(...args);
    }
}