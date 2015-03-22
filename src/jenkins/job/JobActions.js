import Action from "../../flux/Action";

export default {
    /**
     * @param {String} jobName
     * @param {Object} params
     */
    triggerBuild: new Action("jobTrigger"),
    /**
     * @param {Object} repoBranches
     * @param {String} changelog
     */
    triggerPullRequest: new Action("jobTriggerPullRequest"),
    /**
     * @param {String} jobName
     * @param {moment} olderThan
     */
    unkeepBuilds: new Action("jobUnkeepBuilds")
}