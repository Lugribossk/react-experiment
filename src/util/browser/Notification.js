/*global module*/
if (window.Notification) {
    module.exports = window.Notification;
} else {
    module.exports = {
        permission: "denied"
    };
}
