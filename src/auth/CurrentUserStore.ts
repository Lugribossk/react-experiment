import User from "../auth/User";
import * as Promise from "bluebird";
import Store from "../flux/Store";
import {createContext} from "../flux/StoreContext";
import {valueOrThrow} from "../suspense/suspense";
import {login, logout} from "./AuthActions";

let cookieWithToken = false;
const getCurrentUser = () => Promise.delay(200, cookieWithToken ? new User() : undefined);
const getToken = (username: string, password: string) => Promise.delay(200, {}).then(() => (cookieWithToken = true));

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

    constructor() {
        super();
        this.state = {
            user: getCurrentUser(),
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
            await getToken(username, password);
            const user = await getCurrentUser();
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

    private handleLogout() {
        this.setState({user: Promise.resolve(undefined)});
    }
}
