import {hot} from "./util/hot-loader";
import * as React from "react";
import {HashRouter, Switch} from "react-router-dom";
import {PrivateRoute} from "./app/Route";
import Placeholder from "./suspense/Placeholder";
import {Loader} from "semantic-ui-react";
import CurrentUserStore from "./auth/CurrentUserStore";
import ErrorBoundary from "./app/ErrorBoundary";
import ErrorPage from "./ErrorPage";
import MultiplePage from "./MultiplePage";
import Api from "./Api";

class App extends React.Component<{}> {
    private readonly api: Api;
    private readonly currentUserStore: CurrentUserStore;

    constructor(props: {}) {
        super(props);
        this.api = new Api();
        this.currentUserStore = new CurrentUserStore(this.api);
    }

    renderRoutes() {
        return (
            <Switch>
                <PrivateRoute path="/multiple" component={MultiplePage} />
                <PrivateRoute path="/dynamic" dynamic={() => import("./DynamicPage")} />
                <PrivateRoute path="/error" component={ErrorPage} />
                <PrivateRoute path="/" exact render={() => <h1>React experiments</h1>} />
                <PrivateRoute render={() => <p>Not found</p>} />
            </Switch>
        );
    }

    render() {
        // The fallback loader should be identical to the loader markup inside the React root in index.html.
        return (
            <HashRouter>
                <ErrorBoundary>
                    <CurrentUserStore.Context.Provider value={this.currentUserStore}>
                        <Placeholder
                            fallback={
                                <Loader active size="huge">
                                    Loading...
                                </Loader>
                            }
                        >
                            {this.renderRoutes()}
                        </Placeholder>
                    </CurrentUserStore.Context.Provider>
                </ErrorBoundary>
            </HashRouter>
        );
    }
}

export default hot(module)(App);
