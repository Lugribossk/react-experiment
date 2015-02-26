import Store from "../flux/Store";
import ReactUpdates from "react/lib/ReactUpdates";

export default class TickStore extends Store {
    constructor() {
        super();

        this.setupBatching();
        this.setupRAF();
    }

    onTick(listener) {
        return this._registerListener("tick", listener);
    }

    setupRAF() {
        var startTime, endTime;
        var tick = () => {
            startTime = window.performance.now();
            var sinceLast = startTime - endTime;

            this._trigger("tick", sinceLast);
            ReactUpdates.flushBatchedUpdates();

            requestAnimationFrame(tick);
            endTime = window.performance.now();
            var elapsed = endTime - startTime;
        };

        endTime = window.performance.now();
        tick();
    }

    setupBatching() {
        ReactUpdates.injection.injectBatchingStrategy({
            isBatchingUpdates: true,
            batchedUpdates: function (callback, ...args) {
                callback(...args);
            }
        });
    }
}