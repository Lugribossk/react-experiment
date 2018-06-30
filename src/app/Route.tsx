import * as React from "react";
import {Route, RouteProps, RouteComponentProps} from "react-router-dom";
import LoginPage from "../auth/LoginPage";
import Layout from "../app/Layout";

import CurrentUserStore from "../auth/CurrentUserStore";
interface Props extends RouteProps {
    render(props: RouteComponentProps<any>): React.ReactNode;
}

export class PublicRoute extends React.Component<Props> {
    render() {
        const {render, ...rest} = this.props;
        return <Route {...rest} render={rp => <Layout>{render(rp)}</Layout>} />;
    }
}

export class PrivateRoute extends React.Component<Props> {
    render() {
        const {render, path, ...rest} = this.props;
        return (
            <Route
                {...rest}
                path={path}
                render={rp => (
                    <CurrentUserStore.Context.Consumer>
                        {store => {
                            const user = store.getUser();
                            if (!user) {
                                return (
                                    <Layout fullWindow>
                                        <LoginPage loginAttempt={store.getLoginAttempt()} />
                                    </Layout>
                                );
                            }
                            return <Layout user={user}>{render(rp)}</Layout>;
                        }}
                    </CurrentUserStore.Context.Consumer>
                )}
            />
        );
    }
}
