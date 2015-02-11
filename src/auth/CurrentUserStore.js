import Store from "../flux/Store";
import AuthActions from "./AuthActions";

export default class CurrentUserStore extends Store {
    constructor(api) {
        super();
        this.api = api;

        this.state = {
            user: null
        };

        AuthActions.tryCredentials.onDispatch(this.tryCredentials.bind(this));
        AuthActions.logout.onDispatch(this.logout.bind(this));
    }

    tryCredentials(username, password) {

        this.api.authenticate(username, password)
            .catch((err) => {
                this._trigger("invalidLogin");
            }).then(() => {
                return this.api.get("/users/current");
            }).then((user) => {
                console.info("Logged in as", user.username);
                this.setState({user: user});
            }).catch((err) => {
                console.error("Unable to get current user:", err);
            });
    }

    logout() {
        this.setState({user: null});
    }

    getUser() {
        return this.state.user;
    }

    onUserChange(listener) {
        return this._registerListener("user", listener);
    }

    onNextLogin(listener) {
        var remove = this.onUserChange(user => {
            if (user) {
                remove();
                listener();
            }
        });
    }

    onInvalidLogin(listener) {
        return this._registerListener("invalidLogin", listener);
    }
}