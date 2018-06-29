type Listener = (...args: any[]) => void;
type Unsubscriber = () => void;

/**
 * Dispatching (i.e. calling) an action.
 */
interface Dispatch {
    /**
     * Dispatch the action with the specified arguments.
     * Individual actions should override the call signature with their exact argument types.
     */
    (...args: any[]): void;
}

/**
 * Listening (i.e. getting a callback when it is dispatched) to an action.
 */
interface Listen<T extends Dispatch> {
    /**
     * Listen for the action being dispatched.
     * In Redux terms this lets us attach the "reducer" that handles this specific action (but without needing the giant
     * switch statement for all possible actions).
     * @returns A function that can be called to stop listening.
     */
    onDispatch(listener: T): Unsubscriber;
}

/**
 * A Flux "action" that components can call to change state in the stores.
 * In Redux terms this is more of a "bound action creator", i.e. a function that you can call with action-specific
 * arguments which end up causing a change in application state.
 */
export type Action<T extends Dispatch> = T & Listen<T>;

/**
 * Define a specific Flux action.
 * Saving the return value of this is comparable to defining Redux "action type constants", i.e. a singleton that
 * defines a particular kind of action.
 */
export const defineAction = <T extends Dispatch>(): Action<T> => {
    let listeners: Listener[] = [];

    const dispatchAction: any = (...args: any[]) => {
        listeners.forEach(lst => lst(...args));
    };

    dispatchAction.onDispatch = (listener: Listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(lst => lst !== listener);
        };
    };

    return dispatchAction;
};
