import React from "react";
import AuthenticatingRouter from "./AuthenticatingRouter";

export default class ExampleRouter extends AuthenticatingRouter {
    constructor(element, authController) {
        super(authController);
        this.element = element;

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
        });
    }

    show(stuff) {
        React.render(stuff, this.element);
    }
}