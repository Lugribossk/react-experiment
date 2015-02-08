import React from "react";
import {Grapnel} from "grapnel/src/grapnel";

export default class ExampleRouter extends Grapnel {
    constructor(element, authController) {
        super();
        this.element = element;

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

        this.get("test1", () => {
            this.show(<h1>Test 1</h1>);
        });
        this.get("test2/:id", (req) => {
            this.show(<h1>Test 2 - {req.params.id}</h1>);
        });
        this.get("", () => {
            this.show(<h1>Dashboard</h1>);
        });
        this.get("*", (r, event) => {
            if (!event.parent()) {
                this.navigate("");
            }
        })
    }

    show(stuff) {
        React.render(stuff, this.element);
    }
}