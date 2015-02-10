import React from "react";
import AuthenticatingRouteStore from "../auth/AuthenticatingRouteStore";

export default class ExampleRouteStore extends AuthenticatingRouteStore {
    constructor(userStore) {
        super(userStore);

        this.add("test1", () => {
            this.show(<h1>Test 1</h1>);
        });
        this.add("test2/:id", (req) => {
            this.show(<h1>Test 2 - {req.params.id}</h1>);
        });
        this.add("", () => {
            this.show(<h1>Dashboard</h1>);
        });
        this.add("*", (r, event) => {
            if (!event.parent()) {
                this.navigate("");
            }
        });
    }
}