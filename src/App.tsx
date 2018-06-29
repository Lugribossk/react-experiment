import {hot} from "./hot-loader";
import * as React from "react";
import {HashRouter, Route, Link, Switch} from "react-router-dom";
import Name from "./Name";
import Placeholder from "./future/Placeholder";
import {ImportFetcher} from "./future/Fetcher";
import User from "./auth/User";
import {login} from "./auth/AuthActions";
import PrivateRoute from "./auth/PrivateRoute";

const blahFetcher = new ImportFetcher(() => import("./Blah"));

const BlahDynamic = (props: import("./Blah").Props) => {
    const {default: Blah} = blahFetcher.read();
    return <Blah {...props} />;
};

interface State {
    user: User | undefined;
}

class App extends React.Component<{}, State> {
    private readonly unsubscribers: (() => void)[];

    constructor(props: {}) {
        super(props);
        this.state = {
            user: undefined
        };
        this.unsubscribers = [];
    }

    componentDidMount() {
        this.unsubscribers.push(login.onDispatch((username, password) => this.setState({user: new User()})));
    }

    componentWillUnmount() {
        this.unsubscribers.forEach(unsub => unsub());
    }

    render() {
        const {user} = this.state;
        return (
            <HashRouter>
                <div>
                    <h1>Suspend test</h1>
                    {user && (
                        <p>
                            <button onClick={() => this.setState({user: undefined})}>Log out</button>
                        </p>
                    )}
                    <Link to="/multiple">Multiple</Link>
                    <Link to="/dynamic">Dynamic load</Link>
                    <br />
                    <Placeholder delayMs={500} fallback={<p>Loading...</p>} key={window.location.href}>
                        <Switch>
                            <PrivateRoute path="/private" user={user} render={() => <p>Private</p>} />
                            <Route
                                path="/multiple"
                                render={() => (
                                    <>
                                        <Name name="1" />
                                        <Name name="22" />
                                        <Name name="333" />
                                        <Name name="4444" />
                                    </>
                                )}
                            />
                            <Route path="/dynamic" render={() => <BlahDynamic name="test" />} />
                            <Route path="/" exact render={() => <p>Welcome</p>} />
                            <Route render={() => <p>Not found</p>} />
                        </Switch>
                    </Placeholder>
                </div>
            </HashRouter>
        );
    }
}

export default hot(module)(App);
