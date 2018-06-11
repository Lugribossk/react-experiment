import * as React from "react";
import * as Promise from "bluebird";

interface Props {
    delayMs?: number;
    fallback: React.ReactNode | ((progress: number) => React.ReactNode);
}

interface State {
    loading: number;
    maxLoading: number;
    showFallback: boolean;
}

/**
 * An experimental implementation of the upcoming "suspense" React feature that catches loading events from deeper in
 * the component tree and displays a placeholder instead.
 * See https://youtu.be/v6iR3Zk4oDY?t=14m15s
 */
export default class Placeholder extends React.Component<Props, State> {
    private unmounted: boolean;
    private fallbackTimer: number | undefined;

    constructor(props: Props) {
        super(props);
        this.unmounted = false;
        this.state = {
            loading: 0,
            maxLoading: 0,
            showFallback: false
        }
    }

    componentDidCatch(error: Error | Promise<any>, errorInfo: React.ErrorInfo) {
        if (!(error instanceof Promise)) {
            throw error;
        }
        this.setState(({loading, maxLoading, showFallback}) => {
            if (loading === 0) {
                clearTimeout(this.fallbackTimer);
                this.fallbackTimer = window.setTimeout(() => {
                    this.setState({showFallback: true});
                }, this.props.delayMs);
                maxLoading = 0;
                showFallback = false;
            }

            return {
                loading: loading + 1,
                maxLoading: Math.max(maxLoading, loading + 1),
                showFallback: showFallback
            };
        });

        error.then(() => {
            if (this.unmounted) {
                return;
            }
            this.setState(({loading}) => {
                if (loading === 1) {
                    clearTimeout(this.fallbackTimer);
                }
                return {loading: loading - 1}
            });
        });
    }

    componentWillUnmount() {
        this.unmounted = true;
        clearTimeout(this.fallbackTimer);
    }

    render() {
        const {fallback, children} = this.props;
        const {loading, maxLoading, showFallback} = this.state;

        if (loading === 0) {
            return children;
        }
        if (showFallback) {
            if (fallback instanceof Function) {
                return fallback((maxLoading - loading) / maxLoading);
            }
            return fallback;
        }
        return null;
    }
}