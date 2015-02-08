import _ from "lodash";

export default class Action {
    constructor (name) {
        var listeners = [];
        this.listeners = listeners;
        this.name = name;

        function triggerAction(...args) {
            _.forEach(listeners, (listener) => {
                listener.apply(null, args);
            });
        }

        triggerAction.listeners = listeners;
        triggerAction.name = this.name;
        triggerAction.onTrigger = this.onTrigger;

        return triggerAction;
    }

    onTrigger(listener) {
        this.listeners.push(listener);
        return () => {
            _.remove(this.listeners, (el) => {
                return el === listener;
            });
        }
    }
}