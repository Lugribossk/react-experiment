import React from "react";
import {ConsumerProps, Context} from "react";
import Store from "./Store";

/**
 * Create a React context where the value is a store.
 * When the store content changes, consumer children are automatically re-rendered.
 */
export const createContext = <T extends Store<any>>(): Context<T> => {
    const context = React.createContext((undefined as any) as T);

    return {
        Provider: context.Provider,
        Consumer: class StoreContextConsumer extends React.Component<ConsumerProps<T>> {
            private unsubscribe?: () => void;
            private store?: T;

            componentDidMount() {
                // We need to make sure that we subscribe only once, and that if we do, we also unsubscribe.
                // ComponentDidMount + componentWillUnmount works well for that, but componentDidMount does not have
                // access to the store since it arrives as a callback parameter inside render rather than as a prop.
                // Therefore we need to save a reference in render so that we can use it here. Fortunately we know that
                // the store will always be the same (that is why we're doing this trick in the first place) so we
                // don't need to handle that.
                // Subscribing inside render is not a good idea, since the rendering can fail (e.g. if rendering
                // children throws an error) which causes the instance to be discarded without calling
                // componentWillUnmount, which would then result in a subscription that is never unsubscribed.
                if (!this.store) {
                    throw new Error("Store from context was not set after mounting.");
                }
                this.unsubscribe = this.store.onChange(() => {
                    this.forceUpdate();
                });
            }

            componentWillUnmount() {
                if (this.unsubscribe) {
                    this.unsubscribe();
                }
            }

            render() {
                const {children} = this.props;
                const {Consumer} = context;
                return (
                    <Consumer>
                        {store => {
                            if (!store) {
                                // When hot reloading files involved with contexts, new contexts are created but
                                // for unknown reasons the old consumer components are kept.
                                // Since values are only transferred between the provider/consumer pair that was
                                // created together, the old consumers then start getting the default value.
                                // This also seems to happen with the default React context consumer component.
                                const message = `Missing context value.${
                                    process.env.NODE_ENV !== "production"
                                        ? " This is probably due to react-hot-loader, please manually reload the page"
                                        : ""
                                }`;
                                throw new Error(message);
                            }
                            if (!this.store) {
                                this.store = store;
                            }
                            return children(store);
                        }}
                    </Consumer>
                );
            }
        } as any
    };
};
