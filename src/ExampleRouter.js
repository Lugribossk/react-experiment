import React from "react";
import {Grapnel} from "grapnel/src/grapnel";

export default class ExampleRouter extends Grapnel {
    constructor(element, authController) {
        super();
        this.element = element;

        //var lastAttemptedRoute;
        this.on("match", (event) => {
            if (!authController.getCurrentUser()) {
                event.preventDefault();
                //lastAttemptedRoute = event.callback;

                authController.attemptLogin()
                    .then(event.callback);
                    //.then(() => {
                    //    attemptedRoute();
                    //})
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
    }

    show(stuff) {
        React.render(stuff, this.element);
    }
}