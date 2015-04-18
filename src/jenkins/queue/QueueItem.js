import BuildLike from "../build/BuildLike";

/**
 * A queued build that will be started sometime in the future for a particular Jenkins job.
 */
export default class QueueItem extends BuildLike {
    getId() {
        return this.id;
    }

    getJobName() {
        return this.task.name;
    }
}