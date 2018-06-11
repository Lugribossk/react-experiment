type Listener = () => void;
type Unsubscriber = () => void;

/**
 * A Flux "store", a repository of data state that listens to actions and triggers events when changed.
 */
export default abstract class Store<T> {
    private listeners: Listener[];
    private unsubscribers: Unsubscriber[];
    protected state!: Readonly<T>;

    protected constructor() {
        this.listeners = [];
        this.unsubscribers = [];
    }

    onChange(listener: Listener): Unsubscriber {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(lst => lst !== listener);
        }
    }

    /**
     * Synchronously change the stored state.
     */
    protected setState(newState: Partial<T>) {
        this.state = {
            ...this.state as any,
            ...newState as any
        };
        this.listeners.slice().forEach(lst => lst());
    }

    protected subscribe(unsubscriber: Unsubscriber) {
        this.unsubscribers.push(unsubscriber);
    }

    close() {
        this.unsubscribers.forEach(un => un());
        this.unsubscribers = [];
        this.listeners = [];
    }
}
