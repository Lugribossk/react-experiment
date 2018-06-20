import {hot} from "./hot-loader";
import * as React from "react";
import Name from "./Name";
import Placeholder from "./future/Placeholder";
import {ImportFetcher} from "./future/Fetcher";

const blahFetcher = new ImportFetcher(() => import("./Blah"));

const BlahLoader = (props: import("./Blah").Props) => {
    const {default: Blah} = blahFetcher.read();
    return <Blah {...props} />;
};

class App extends React.Component<{}, {blah: boolean}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            blah: true
        };
    }

    render() {
        return (
            <div>
                <h1>Suspend test</h1>
                <button onClick={() => this.setState(({blah}) => ({blah: !blah}))}>Swap</button>
                <br />
                <Placeholder delayMs={500} fallback={<p>Loading...</p>} key={`${this.state.blah}`}>
                    {this.state.blah ? (
                        <>
                            <Name name="1" />
                            <Name name="22" />
                            <Name name="333" />
                            <Name name="4444" />
                        </>
                    ) : (
                        <>
                            <BlahLoader name="test" />
                        </>
                    )}
                </Placeholder>
            </div>
        );
    }
}

export default hot(module)(App);
