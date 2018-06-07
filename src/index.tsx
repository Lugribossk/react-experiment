import * as React from "react";
import * as ReactDOM from "react-dom";

const render = () => {
    const {default: App} = require("./App");
    ReactDOM.render(
        <App/>,
        document.getElementById("root")
    );
};

render();

if (process.env.NODE_ENV !== "production") {
    (module as any).hot.accept(render);
}
