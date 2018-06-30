import * as React from "react";
import * as ReactDOM from "react-dom";
import ErrorBoundary from "./app/ErrorBoundary";

const render = () => {
    // tslint:disable-next-line:no-require-imports
    const {default: App} = require("./App");
    ReactDOM.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>,
        document.getElementById("root")
    );
};

render();

if (process.env.NODE_ENV !== "production") {
    (module as any).hot.accept(render);
}
