import * as React from "react";

export interface Props {
    name: string;
}

export default class Blah extends React.Component<Props> {
    render() {
        return <p>Test</p>;
    }
}
