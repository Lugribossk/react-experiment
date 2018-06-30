import {hot} from "./hot-loader";
import * as React from "react";
import {HashRouter, Switch} from "react-router-dom";
import Name from "./Name";
import {ImportFetcher} from "./future/Fetcher";
import User from "./auth/User";
import {login, logout} from "./auth/AuthActions";
import {PrivateRoute} from "./app/Route";
import ErrorBoundary from "./app/ErrorBoundary";
import "semantic-ui-css/semantic.min.css";
import Placeholder from "./future/Placeholder";
import {Loader} from "semantic-ui-react";

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
        this.unsubscribers.push(logout.onDispatch(() => this.setState({user: undefined})));
    }

    componentWillUnmount() {
        this.unsubscribers.forEach(unsub => unsub());
    }

    renderRoutes() {
        const {user} = this.state;
        return (
            <Switch>
                <PrivateRoute path="/private" user={user} render={() => <p>Private</p>} />
                <PrivateRoute
                    path="/multiple"
                    user={user}
                    render={() => (
                        <>
                            <Name name="1" />
                            <Name name="22" />
                            <Name name="333" />
                            <Name name="4444" />
                        </>
                    )}
                />
                <PrivateRoute path="/dynamic" user={user} render={() => <BlahDynamic name="test" />} />
                <PrivateRoute path="/" exact user={user} render={() => <h1>React experiments</h1>} />
                <PrivateRoute user={user} render={() => <p>Not found</p>} />
            </Switch>
        );
    }

    render() {
        return (
            <HashRouter>
                <ErrorBoundary>
                    <Placeholder
                        delayMs={500}
                        fallback={
                            <Loader active size="huge">
                                Loading...
                            </Loader>
                        }
                    >
                        {this.renderRoutes()}
                    </Placeholder>
                </ErrorBoundary>
            </HashRouter>
        );
    }
}

export default hot(module)(App);
