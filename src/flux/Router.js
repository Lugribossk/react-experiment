import _ from "lodash";

var singleton;

/**
 * Hash fragment navigation router for the Route component.
 *
 * Router instance must be created before rendering any Route components.
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
        this.defaultPath = null;
        this.notFound = false;
        this.window = win || window;

        this.window.addEventListener("hashchange", this.whenHashChange.bind(this));
        this.whenHashChange({newURL: this.window.location.href});

        singleton = this;
    }

    /**
     * Listen for the current route changing.
     * @param {function} listener
     * @returns {Function}
     */
    onRouteChange(listener) {
        this.listeners.push(listener);
        return () => {
            _.remove(this.listeners, (el) => {
                return el === listener;
            });
        };
    }

    /**
     * Get the parameters extracted from the current route.
     * @returns {Object}
     */
    getParameters() {
        return this.parameters;
    }

    /**
     * Get the current route.
     * @returns {String}
     */
    getRoute() {
        return this.hash;
    }

    /**
     * Check whether the provided path is a part of the current route.
     * This is useful for marking links that lead to the current route as active.
     *
     * @param {String} path
     * @returns {Boolean}
     */
    currentRouteMatches(path) {
        if (_.contains(path, ":")) {
            path = path.substr(0, path.indexOf(":") - 1);
        }

        var isDefault = (path === "" && this.hash === "");
        var isSubpath = (path.length > 0 && this.hash.indexOf(path) === 0);
        var nextIsSlash = this.hash.length > path.length && this.hash.charAt(path.length) === "/" || this.hash.length === path.length;

        return isDefault || (isSubpath && nextIsSlash);
    }

    register(listener, path, defaultPath=false) {
        this.listeners.push(listener);

        var extractor = Router.createExtractor(path);
        this.extractors.push(extractor);

        if (defaultPath) {
            if (this.defaultPath !== null) {
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
        };
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

        if (this.defaultPath !== null) {
            this.window.location.hash = this.defaultPath + " ";
            return;
        }

        this.notFound = true;
    }

    static createExtractor(path) {
        var parameterNames = Router.getMatches(/:(\w+)(?:\/|$)/g, path);
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
        };
    }

    static getMatches(regex, text) {
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

    static getParameters(...args) {
        return singleton.getParameters(...args);
    }

    static currentRouteMatches(...args) {
        return singleton.currentRouteMatches(...args);
    }
}