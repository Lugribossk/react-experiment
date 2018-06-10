import {hot} from "./hot-loader";
import * as React from "react";
import Name from "./Name";
import Placeholder from "./future/Placeholder";

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
                <br/>
                <Placeholder delayMs={500} fallback={<p>Loading...</p>} key={"" + this.state.blah}>
                    {this.state.blah ?
                        <>
                            <Name name="1"/>
                            <Name name="22"/>
                            <Name name="333"/>
                            <Name name="4444"/>
                        </>
                        :
                        <>
                            <Name name="test3"/>
                            <Name name="test4"/>
                        </>
                    }
                </Placeholder>
            </div>
        )
    }
}

export default hot(module)(App);
