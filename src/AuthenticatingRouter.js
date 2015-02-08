import {Grapnel} from "grapnel/src/grapnel";

export default class AuthenticatingRouter extends Grapnel {
    constructor(authController) {
        super();

        var lastValue;
        this.on("match", (event) => {
            // Only do the auth check on the first route matched, as the * route will always be the second route matched.
            if (lastValue === event.value) {
                event.preventDefault();
                return;
            }
            lastValue = event.value;

            if (!authController.getCurrentUser()) {
                event.preventDefault();

                authController.attemptLogin()
                    .then(() => {
                        lastValue = null;
                        event.callback();
                    })
            }
        });
    }
}