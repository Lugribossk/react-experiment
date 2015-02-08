import Store from "../util/Store";

export default class CurrentUserStore extends Store {
    constructor() {
        super();

        this.state = {
            user: null
        };
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