import React from "react";
import User from "../auth/User";
import Toolbar from "./Toolbar";
import {Container, Loader, Segment} from "semantic-ui-react";
import ErrorBoundary from "./ErrorBoundary";
import Placeholder from "../suspense/Placeholder";

interface Props {
    pathname: string;
    user?: User;
    fullWindow?: boolean;
}

export default class Layout extends React.Component<Props> {
    render() {
        const {pathname, user, fullWindow = false, children} = this.props;
        const ContainerComponent = fullWindow ? React.Fragment : Container;

        // Use the current path as a key to the error boundary so that the component is recreated and goes back to its
        // default state if we change routes. Otherwise an error on one route will cause it to keep showing the error
        // message even on another route.
        return (
            <>
                {user && <Toolbar user={user} />}
                <ErrorBoundary key={pathname}>
                    <Placeholder
                        delayMs={500}
                        fallback={
                            <Loader active size="huge">
                                Loading...
                            </Loader>
                        }
                    >
                        <ContainerComponent>{children}</ContainerComponent>
                    </Placeholder>
                </ErrorBoundary>
                <Segment inverted vertical style={{position: "absolute", bottom: 0, width: "100%"}}>
                    Footer
                </Segment>
            </>
        );
    }
}
