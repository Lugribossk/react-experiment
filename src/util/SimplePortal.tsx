import React from "react";
import {ComponentClass, RefObject} from "react";
import ReactDom from "react-dom";

interface SimplePortal {
    Source: ComponentClass<{}>;
    Target: ComponentClass<{}>;
}

export const createPortal = (): SimplePortal => {
    const targetElement = document.createElement("div");
    return {
        Source: class PortalSource extends React.Component<{}> {
            render() {
                return ReactDom.createPortal(this.props.children, targetElement);
            }
        },
        Target: class PortalTarget extends React.Component<{}> {
            private readonly ref: RefObject<HTMLDivElement>;

            constructor(props: {}) {
                super(props);
                this.ref = React.createRef();
            }

            componentDidMount() {
                if (this.ref.current) {
                    this.ref.current.appendChild(targetElement);
                }
            }

            componentWillUnmount() {
                if (this.ref.current && this.ref.current.contains(targetElement)) {
                    this.ref.current.removeChild(targetElement);
                }
            }

            render() {
                return <div ref={this.ref} />;
            }
        }
    };
};
