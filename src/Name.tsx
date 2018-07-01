import * as React from "react";
import * as Promise from "bluebird";
import {createFetcher} from "./suspense/Fetcher";

const nameFetcher = createFetcher((name: string) => Promise.delay(name.length * 1000, name));

export default class Name extends React.Component<{name: string}> {
    render() {
        return <p>Hello {nameFetcher.read(this.props.name)}!</p>;
    }
}
