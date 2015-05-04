import _ from "lodash";
import RegExps from "../util/RegExps";

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
        this.defaultPath = null;
        this.currentHashNotMatched = false;
        this.window = win || window;

        this.window.addEventListener("hashchange", this.whenHashChange.bind(this));
        this.whenHashChange({newURL: this.window.location.href});
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
     * Returns a function that calls #currentRouteMatches().
     * A new function is returned on each call, meaning that it can be assigned to a component's state.
     * This allows that component to have a "pure" render method, rather than it calling #currentRouteMatches()
     * directly and thus needing to force update on route changes.
     * @returns {Function}
     */
    getCurrentRouteMatcher() {
        return (path) => {
            return this.currentRouteMatches(path);
        };
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

    /**
     * Register a route.
     * @param {Function} listener
     * @param {String} path
     * @param {Boolean} [defaultPath]
     * @returns {Function}
     */
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

        if (this.currentHashNotMatched) {
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
        this.currentHashNotMatched = false;

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

        this.currentHashNotMatched = true;
    }

    /**
     * Create function that extracts parameters from a path, if they exist.
     * @param {String} path The path specifier, e.g. "documents/:id".
     * @returns {Function} Function that when called with a path, returns an object
     * with the extracted parameters, or null if it does not match.
     */
    static createExtractor(path) {
        // :id or :id?, followed by / or the end of the string.
        var parameterNames = RegExps.getAllMatches(/:(\w+)\??(?:\/|$)/g, path);
        // Construct a regex string that will extract the parameters.
        var parameterChar = "[\\w\\%\\-]";
        var extractParameters = path.replace(/\\/g, "\\/")
            .replace(/\/(:\w+\?)/g, "(?:\\/(" + parameterChar + "*))?")
            .replace(/(:\w+)/g, "(" + parameterChar + "+)");
        var matchAndExtract = new RegExp("^" + extractParameters + "$");

        return (possiblePath) => {
            var match = possiblePath.match(matchAndExtract);
            if (!match) {
                return null;
            }

            var parameters = {};
            for (var i = 0; i < parameterNames.length; i++) {
                var name = parameterNames[i];
                var value = match[i + 1];
                if (value) {
                    parameters[name] = decodeURIComponent(value);
                }
            }

            return parameters;
        };
    }
}