import React from "react";
import Promise from "bluebird";
import {createFetcher} from "./suspense/Fetcher";

const fetcher = createFetcher(() => Promise.delay(2000).throw(new Error("Error while loading data.")));

export default class ErrorPage extends React.Component<{}> {
    render() {
        fetcher.read("");
        return null;
    }
}
