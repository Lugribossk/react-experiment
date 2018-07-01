import * as React from "react";

export default class ErrorPage extends React.Component<{}> {
    render() {
        throw new Error("Rendering error");
        return null;
    }
}
