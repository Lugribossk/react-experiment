import * as React from "react";

export interface Props {
    name: string;
}

export default class DynamicPage extends React.Component<Props> {
    render() {
        return <p>This component was dynamically loaded.</p>;
    }
}
