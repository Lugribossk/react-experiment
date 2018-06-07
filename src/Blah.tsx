import * as React from "react";
import * as Promise from "bluebird";
import {createFetcher} from "./future/fetcher";

const blahFetcher = createFetcher<string, string>(name => Promise.delay(0, name));

export default class Blah extends React.Component<{}> {
    render() {
        return (
            <p>Hello {blahFetcher.read("world")}!</p>
        );
    }
}
