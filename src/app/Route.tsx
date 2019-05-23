import React from "react";
import {Route, RouteProps, RouteComponentProps} from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import Layout from "../app/Layout";
import CurrentUserStore from "../auth/CurrentUserStore";
import {createImportFetcher} from "../suspense/Fetcher";

interface Props extends RouteProps {
    dynamic?(): PromiseLike<any>;
}

class RouteContent extends React.Component<{renderProps: RouteComponentProps<any>} & Props> {
    render() {
        const {component, render, dynamic, renderProps} = this.props;
        if (component) {
            const Component = component;
            return <Component {...renderProps} />;
        }
        if (render) {
            return render(renderProps);
        }
        if (dynamic) {
            const {default: Component} = createImportFetcher(dynamic).read();
            return <Component {...renderProps} />;
        }
        throw new Error("Route children not supported.");
    }
}

export class PublicRoute extends React.Component<Props> {
    render() {
        const {component, render, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={rp => (
                    <Layout pathname={rp.location.pathname}>
                        <RouteContent {...this.props} renderProps={rp} />
                    </Layout>
                )}
            />
        );
    }
}

export class PrivateRoute extends React.Component<Props> {
    render() {
        const {component, render, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={rp => (
                    <CurrentUserStore.Context.Consumer>
                        {store => {
                            const user = store.getUser();
                            if (!user) {
                                return (
                                    <Layout pathname={rp.location.pathname} fullWindow>
                                        <LoginPage loginAttempt={store.getLoginAttempt()} />
                                    </Layout>
                                );
                            }
                            return (
                                <Layout pathname={rp.location.pathname} user={user}>
                                    <RouteContent {...this.props} renderProps={rp} />
                                </Layout>
                            );
                        }}
                    </CurrentUserStore.Context.Consumer>
                )}
            />
        );
    }
}
