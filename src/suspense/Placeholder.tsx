import React, {Suspense} from "react";

interface Props {
    delayMs?: number;
    fallback: React.ReactChild;
}

export default class Placeholder extends React.Component<Props> {
    render() {
        return <Suspense fallback={this.props.fallback} children={this.props.children} />;
    }
}
