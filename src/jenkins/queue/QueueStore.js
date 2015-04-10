import _ from "lodash";
import request from "superagent-bluebird-promise";
import Promise from "bluebird";
import CachingStore from "../../flux/CachingStore";
import QueueItem from "./QueueItem";
import QueueActions from "./QueueActions";
import JobActions from "../job/JobActions";

export default class QueueStore extends CachingStore {
    constructor(jobName) {
        super(__filename);
        this.jobName = jobName;
        this.state = this.getCachedState() || {
            queue: []
        };

        QueueActions.abort.onDispatch(this.abort.bind(this));
        JobActions.triggerBuild.onDispatch(this.triggerBuild.bind(this));

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
            .then(() => {
                this._updateQueue();
            });
    }

    triggerBuild(jobName) {
        if (jobName === this.jobName) {
            setTimeout(() => {
                this._updateQueue();
            }, 500);
        }
    }

    _updateQueue() {
        request.get("/queue/api/json")
            .query("tree=items[id,actions[parameters[name,value],causes[userId,userName]],task[name]]")
            .then((result) => {
                var items = _.map(result.body.items, (item) => {
                    return new QueueItem(item);
                });
                var sameJob = _.filter(items, (item) => {
                    return item.getJobName() === this.jobName;
                });
                this.setState({queue: sameJob});
            })
            .catch(() => {});
    }

    unmarshalState(data) {
        return {
            queue: CachingStore.listOf(data.queue, QueueItem)
        };
    }
}
