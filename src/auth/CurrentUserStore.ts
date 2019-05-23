import Promise from "bluebird";
import User from "../auth/User";
import Store from "../flux/Store";
import {createContext} from "../flux/StoreContext";
import {valueOrThrow} from "../suspense/suspense";
import {login, logout} from "./AuthActions";
import Api from "../Api";

export type LoginAttempt = "success" | "loading" | "failed";

interface State {
    // There's three possible states for the currently logged in user:
    // 1. We don't know, since the page has just loaded and we don't know if we have any valid saved credentials (= promise pending).
    // (We don't know if we have any credentials at all if they're stored in an HttpOnly cookie, and regardless we don't know if they're still valid.)
    // 2. We know we don't have a user since the possible credentials or login attempt failed to get us one (= promise resolved with undefined).
    // 3. We know we have a a user since the credentials/login attempt succeeded in getting us a user object (= promise resolved with user).
    user: Promise<User | undefined>;
    // Track the state of attempting to login separately, rather than mixing it together with case 1 above as they
    // should look different in the UI (i.e. while sending a login attempt to the server, don't change the user promise until it succeeds)
    loginAttempt: LoginAttempt;
}

export default class CurrentUserStore extends Store<State> {
    static Context = createContext<CurrentUserStore>();

    private readonly api: Api;

    constructor(api: Api) {
        super();
        this.api = api;
        this.state = {
            user: Promise.resolve(this.api.getCurrentUser()),
            loginAttempt: "success"
        };
        this.subscribe(login.onDispatch((u, p) => this.handleLogin(u, p)));
        this.subscribe(logout.onDispatch(() => this.handleLogout()));
    }

    getUser(): User | undefined {
        return valueOrThrow(this.state.user);
    }

    getLoginAttempt() {
        return this.state.loginAttempt;
    }

    private async handleLogin(username: string, password: string) {
        this.setState({
            loginAttempt: "loading"
        });
        try {
            await this.api.login(username, password);
            const user = await this.api.getCurrentUser();
            this.setState({
                user: Promise.resolve(user),
                loginAttempt: "success"
            });
        } catch (e) {
            this.setState({
                user: Promise.resolve(undefined),
                loginAttempt: "failed"
            });
        }
    }

    private async handleLogout() {
        this.setState({user: Promise.resolve(undefined)});
        await this.api.logout();
    }
}
