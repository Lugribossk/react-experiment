import {hot} from "./hot-loader";
import * as React from "react";
import {HashRouter, Switch} from "react-router-dom";
import Name from "./Name";
import {ImportFetcher} from "./future/Fetcher";
import {PrivateRoute} from "./app/Route";
import "semantic-ui-css/semantic.min.css";
import Placeholder from "./future/Placeholder";
import {Loader} from "semantic-ui-react";
import CurrentUserStore from "./auth/CurrentUserStore";

const blahFetcher = new ImportFetcher(() => import("./Blah"));

const BlahDynamic = (props: import("./Blah").Props) => {
    const {default: Blah} = blahFetcher.read();
    return <Blah {...props} />;
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
                <PrivateRoute path="/private" render={() => <p>Private</p>} />
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
                <PrivateRoute path="/dynamic" render={() => <BlahDynamic name="test" />} />
                <PrivateRoute path="/" exact render={() => <h1>React experiments</h1>} />
                <PrivateRoute render={() => <p>Not found</p>} />
            </Switch>
        );
    }

    render() {
        return (
            <HashRouter>
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
            </HashRouter>
        );
    }
}

export default hot(module)(App);
