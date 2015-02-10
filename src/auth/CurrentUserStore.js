import Store from "../flux/Store";
import AuthActions from "./AuthActions";

export default class CurrentUserStore extends Store {
    constructor() {
        super();

        this.state = {
            user: null
        };

        AuthActions.tryCredentials.onDispatch(this.tryCredentials.bind(this));
        AuthActions.logout.onDispatch(this.logout.bind(this));
    }

    tryCredentials(username, password) {
        if (password === "t") {
            this.setState({user: {
                name: "Test Testsen",
                email: "example@example.com"
            }});
        } else {
            this._trigger("invalidLogin");
        }
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