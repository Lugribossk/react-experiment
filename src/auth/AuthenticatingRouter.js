import {Grapnel} from "grapnel/src/grapnel";

export default class AuthenticatingRouter extends Grapnel {
    constructor(currentUserStore) {
        super();

        var lastValue;
        this.on("match", (event) => {
            // Only do the auth check on the first route matched, as the * route will always be the second route matched.
            if (lastValue === event.value) {
                event.preventDefault();
                return;
            }
            lastValue = event.value;

            if (!currentUserStore.getUser()) {
                event.preventDefault();

                //currentUserStore.updateFromLoginForm();
                currentUserStore.onNextLogin(() => {
                    lastValue = null;
                    event.callback();
                });
            }
        });
    }
}