import * as React from "react";
import {Route, RouteProps, RouteComponentProps} from "react-router-dom";
import User from "../auth/User";
import LoginPage from "../auth/LoginPage";
import Layout from "../app/Layout";

interface PublicRouteProps extends RouteProps {
    render(props: RouteComponentProps<any>): React.ReactNode;
}

export class PublicRoute extends React.Component<PublicRouteProps> {
    render() {
        const {render, ...rest} = this.props;
        return <Route {...rest} render={rp => <Layout>{render(rp)}</Layout>} />;
    }
}

interface PrivateRouteProps extends RouteProps {
    user: User | undefined;
    render(props: RouteComponentProps<any>): React.ReactNode;
}

export class PrivateRoute extends React.Component<PrivateRouteProps> {
    render() {
        const {user, render, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={rp => {
                    if (!user) {
                        return (
                            <Layout fullWindow>
                                <LoginPage />
                            </Layout>
                        );
                    }
                    return <Layout user={user}>{render(rp)}</Layout>;
                }}
            />
        );
    }
}
