import * as React from "react";
import User from "../auth/User";
import Toolbar from "./Toolbar";
import {Container, Loader, Segment} from "semantic-ui-react";
import ErrorBoundary from "./ErrorBoundary";
import Placeholder from "../future/Placeholder";

interface Props {
    user?: User;
    fullWindow?: boolean;
}

export default class Layout extends React.Component<Props> {
    render() {
        const {user, fullWindow = false, children} = this.props;
        const ContainerComponent = fullWindow ? React.Fragment : Container;
        return (
            <>
                {user && <Toolbar user={user} />}
                <ErrorBoundary>
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
