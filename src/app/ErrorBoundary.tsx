import * as React from "react";
import {Message} from "semantic-ui-react";

interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
        if (!(error instanceof Error)) {
            throw error;
        }
        this.setState({hasError: true});
    }

    render() {
        const {children} = this.props;
        const {hasError} = this.state;
        if (hasError) {
            return (
                <Message icon="exclamation" negative>
                    <Message.Content>
                        <Message.Header>Something went wrong</Message.Header>
                    </Message.Content>
                </Message>
            );
        }
        return children;
    }
}
