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
    user: Promise<User | undefined>;
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
