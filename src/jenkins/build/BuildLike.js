import _ from "lodash";

/**
 * Abstract class for the parts of builds and queue items that are similar.
 */
export default class BuildLike {
    constructor(data) {
        _.assign(this, data);
    }

    getUserFullName() {
        var cause = this._getCauseWithProperty("userName");
        if (cause) {
            return cause.userName;
        } else {
            return null;
        }
    }

    getUserId() {
        var cause = this._getCauseWithProperty("userId");
        if (cause) {
            return cause.userId;
        } else {
            return null;
        }
    }

    getParameters() {
        var paramList = [];
        _.find(this.actions, (action) => {
            if (action.parameters) {
                paramList = action.parameters;
                return true;
            }
        });

        var params = {};
        _.forEach(paramList, (param) => {
            params[param.name] = param.value;
        });
        return params;
    }

    _getCauseWithProperty(name) {
        var cause = null;
        _.forEach(this.actions, (action) => {
            if (action.causes &&
                action.causes[0] &&
                action.causes[0][name]) {
                cause = action.causes[0];
            }
        });
        return cause;
    }
}