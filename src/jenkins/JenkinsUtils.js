import _ from "lodash";

export default {
    getParameters(actions) {
        var paramList = [];
        _.find(actions, (action) => {
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
    },

    getCauseWithProperty(actions, name) {
        var cause = null;
        _.forEach(actions, (action) => {
            if (action.causes &&
                action.causes[0] &&
                action.causes[0][name]) {
                cause = action.causes[0];
            }
        });
        return cause;
    }
}