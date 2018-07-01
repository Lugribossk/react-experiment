import * as React from "react";
import {Message} from "semantic-ui-react";

interface State {
    error?: Error;
}

export default class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            error: undefined
        };
    }

    componentDidCatch(error: Error | any, errorInfo: React.ErrorInfo) {
        if (!(error instanceof Error)) {
            throw error;
        }
        this.setState({error: error});
    }

    render() {
        const {children} = this.props;
        const {error} = this.state;
        if (error) {
            return (
                <Message negative>
                    <Message.Content>
                        <Message.Header>Something went wrong</Message.Header>
                        <p>{error.message}</p>
                    </Message.Content>
                </Message>
            );
        }
        return children;
    }
}
