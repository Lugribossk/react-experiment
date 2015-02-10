import Store from "../util/Store";
import {Grapnel} from "grapnel/src/grapnel";

export default class AuthenticatingRouteStore extends Store {
    constructor(userStore) {
        super();

        this.grapnel = new Grapnel();

        var lastValue;
        this.grapnel.on("match", (event) => {
            // Only do the auth check on the first route matched, as the * route will always be the second route matched.
            if (lastValue === event.value) {
                event.preventDefault();
                return;
            }
            lastValue = event.value;

            if (!userStore.getUser()) {
                event.preventDefault();

                userStore.onNextLogin(() => {
                    lastValue = null;
                    event.callback();
                });
            } else {
                this.setState({route: event.value});
            }
        });
    }

    onRoute(listener) {
        return this._registerListener("blah", listener);
    }

    add(route, callback) {
        return this.grapnel.get(route, callback);
    }

    navigate(route) {
        return this.grapnel.navigate(route);
    }

    show(content) {
        this.setState({
            content: content
        });
        this._trigger("blah", this.grapnel.fragment.get(), this.state.content);
    }
}