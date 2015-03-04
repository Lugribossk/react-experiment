import Action from "../flux/Action";

export default {
    /**
     * Attempt to log in.
     * @param {String} username
     * @param {String} password
     */
    login: new Action("login"),

    /**
     * Log out.
     */
    logout: new Action("logout")
}