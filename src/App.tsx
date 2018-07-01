import {hot} from "./util/hot-loader";
import * as React from "react";
import {HashRouter, Switch} from "react-router-dom";
import Name from "./Name";
import {ImportFetcher} from "./suspense/Fetcher";
import {PrivateRoute} from "./app/Route";
import Placeholder from "./suspense/Placeholder";
import {Loader} from "semantic-ui-react";
import CurrentUserStore from "./auth/CurrentUserStore";
import ErrorBoundary from "./app/ErrorBoundary";
import ErrorPage from "./ErrorPage";

const dynamicPageFetcher = new ImportFetcher(() => import("./DynamicPage"));

// The non-dynamic import in the type definition doesn't actually import the file, it just references the type so we
// can validate the props.
// Moving the fetcher read into the route render prop causes the thrown promise to originate from this component
// causing it to trigger the overall error boundary, rather than the per-route error boundary.
const DynamicPage: React.StatelessComponent<import("./DynamicPage").Props> = props => {
    const {default: Component} = dynamicPageFetcher.read();
    return <Component {...props} />;
};

class App extends React.Component<{}> {
    private readonly currentUserStore: CurrentUserStore;

    constructor(props: {}) {
        super(props);
        this.currentUserStore = new CurrentUserStore();
    }

    renderRoutes() {
        return (
            <Switch>
                <PrivateRoute
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
                <PrivateRoute path="/dynamic" render={() => <DynamicPage name="test" />} />
                <PrivateRoute path="/error" render={() => <ErrorPage />} />
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
                            delayMs={0}
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
