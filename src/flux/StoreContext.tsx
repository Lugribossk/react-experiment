import * as React from "react";
import {ConsumerProps, Context} from "react";
import Store from "./Store";

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
                // access to the store since it arrives as a callback parameter inside render rather than a prop.
                // Therefore we need to save a reference in render so that we can use here. Fortunately we know that
                // the store will always be the same (that is why we're doing this trick in the first place) so we
                // don't need to handle that.
                // Subscribing inside render is not a good idea, since the rendering can fail (e.g. if rendering
                // children throws an error) which causes the instance to be discarded without calling
                // componentWillUnmount, which results in a zombie subscription.
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
                                // react-hot-loader seems to clear the context value when updating some files.
                                // Perhaps the provider component ends up being for a new context while the consumer keeps the old one?
                                throw new Error("Missing context provider.");
                            }
                            if (!this.store) {
                                this.store = store;
                            }
                            return children(store);
                        }}
                    </Consumer>
                );
            }
        }
    };
};
