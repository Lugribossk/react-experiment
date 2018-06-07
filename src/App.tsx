import {hot} from "./hot-loader";
import * as React from "react";
import Blah from "./Blah";
import Placeholder from "./future/Placeholder";

class App extends React.Component<{}> {
    render() {
        return (
            <div>
                <h1>Blah blah</h1>
                <Placeholder delayMs={2000} fallback={<p>Loading...</p>}>
                    <Blah />
                </Placeholder>
            </div>
        )
    }
}

export default hot(module)(App);
