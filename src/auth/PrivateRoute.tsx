import * as React from "react";
import {Route, RouteProps, RouteComponentProps} from "react-router-dom";
import User from "./User";
import LoginForm from "./LoginForm";

interface Props extends RouteProps {
    user: User | undefined;
    render(props: RouteComponentProps<any>): React.ReactNode;
}

export default class PrivateRoute extends React.Component<Props> {
    render() {
        const {user, render, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={rp => {
                    if (!user) {
                        return <LoginForm />;
                    }
                    return render(rp);
                }}
            />
        );
    }
}
