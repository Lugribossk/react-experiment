import * as React from "react";
import * as Promise from "bluebird";
import {createFetcher} from "./suspense/Fetcher";

const nameFetcher = createFetcher((name: string) => Promise.delay(5000, name));

// const Blah: React.StatelessComponent<{name: string}> = ({name}) => <>{nameFetcher.read(name)}</>;

const Value: React.StatelessComponent<{val(): string}> = ({val}) => <>{val()}</>;

export default class MultiName extends React.Component<{name: string}> {
    render() {
        // waitFor(nameFetcher.promise("Hello"), nameFetcher.promise(this.props.name));

        // return (
        //     <p>{nameFetcher.read("Hello")} {nameFetcher.read(this.props.name)}!</p>
        // );

        // return (
        //     <p><Blah name="Hello" /> <Blah name={this.props.name} />!</p>
        // );

        return (
            <p>
                <Value val={() => nameFetcher.read("Hello")} /> <Value val={() => nameFetcher.read(this.props.name)} />!
            </p>
        );
    }
}
