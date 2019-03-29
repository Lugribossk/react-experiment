type Listener<T extends any[]> = (...args: T) => void;
type Unsubscriber = () => void;

/**
 * A Flux "action" that components can call to change state in the stores.
 * In Redux terms this is more of a "bound action creator", i.e. a function that you can call with action-specific
 * arguments which end up causing a change in application state.
 */
export interface Action<T extends any[]> {
    /**
     * Dispatch (i.e. call) the action with the specified arguments.
     */
    (...args: T): void;
    /**
     * Listen (i.e. get a callback when it is dispatched) for the action being dispatched.
     * In Redux terms this lets us attach the "reducer" that handles this specific action (but without needing the giant
     * switch statement for all possible actions).
     * @returns A function that can be called to stop listening.
     */
    onDispatch(listener: Listener<T>): Unsubscriber;
}

/**
 * Define a specific Flux action.
 * Saving the return value of this is comparable to defining Redux "action type constants", i.e. a singleton that
 * defines a particular kind of action.
 */
export const defineAction = <T extends any[]>(): Action<T> => {
    const listeners = new Set<Listener<T>>();

    const dispatchAction = (...args: T) => {
        listeners.forEach(listener => listener(...args));
    };

    dispatchAction.onDispatch = (listener: Listener<T>): Unsubscriber => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    return dispatchAction;
};
