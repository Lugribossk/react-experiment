import _ from "lodash";
import request from "superagent-bluebird-promise";
import Promise from "bluebird";
import CachingStore from "../../flux/CachingStore";
import QueueItem from "./QueueItem";
import QueueActions from "./QueueActions";

export default class QueueStore extends CachingStore {
    constructor(jobName) {
        super(__filename);
        this.jobName = jobName;
        this.state = this.getCachedState() || {
            queue: []
        };

        QueueActions.abort.onDispatch(this.abort.bind(this));

        this._updateQueue();
        setInterval(this._updateQueue.bind(this), 30 * 1000);
    }

    onQueueChanged(listener) {
        return this._registerListener("queue", listener);
    }

    getQueue() {
        return this.state.queue;
    }

    abort(id) {
        request.post("/queue/cancelItem")
            .query("id=" + id)
            .end();
        Promise.delay(8000)
            .then(() => {
                this._updateQueue();
            });
    }

    _updateQueue() {
        request.get("/queue/api/json")
            .query("tree=items[id,actions[parameters[name,value],causes[userId,userName]],task[name]]")
            .then((result) => {
                var items = _.map(result.body.items, (item) => {
                    return new QueueItem(item);
                });
                var x = _.filter(items, (item) => {
                    return item.getJobName() === this.jobName;
                });
                this.setState({queue: x});
            })
            .catch((err) => {});
    }

    unmarshalState(data) {
        return {
            queue: CachingStore.listOf(data.queue, QueueItem)
        };
    }
}