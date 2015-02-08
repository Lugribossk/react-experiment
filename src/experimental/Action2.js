import _ from "lodash";

export default class Action {
    constructor (name) {
        this.name = name;
        this.listeners = [];
    }

    trigger(...args) {
        _.forEach(this.listeners, (listener) => {
            listener.apply(null, args);
        });
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