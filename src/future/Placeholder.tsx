import * as React from "react";
import * as Promise from "bluebird";

interface Props {
    delayMs?: number;
    fallback: React.ReactNode;
}

interface State {
    loading: boolean;
    timeoutExpired: boolean;
}

export default class Placeholder extends React.Component<Props, State> {
    private unmounted: boolean;
    private timer: number | undefined;

    constructor(props: Props) {
        super(props);
        this.unmounted = false;
        this.state = {
            loading: false,
            timeoutExpired: false
        }
    }

    componentDidMount() {
        const {delayMs = 0} = this.props;
        this.timer = window.setTimeout(() => {
            this.setState({timeoutExpired: true});
        }, delayMs);
    }

    componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
        if (error instanceof Promise) {
            this.setState({loading: true});
            error.then(() => {
                if (this.unmounted) {
                    return;
                }
                this.setState({loading: false});
            })
        } else {
            throw error;
        }
    }

    componentWillUnmount() {
        this.unmounted = true;
        clearTimeout(this.timer);
    }

    render() {
        const {fallback, children} = this.props;
        const {loading, timeoutExpired} = this.state;

        if (!loading) {
            return children;
        }
        if (!timeoutExpired) {
            return null;
        }
        return fallback;
    }
}
