import React from "react/addons";
import _ from "lodash";
import Router from "./Router";

export default class Route extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matched: Router.currentRouteMatches(this.props.path)
        };
    }

    componentWillMount() {
        this.unregister = Router.register(this.whenRouteChange.bind(this), this.props.path, !!this.props.defaultPath);
    }

    componentWillUnmount() {
        this.unregister();
    }

    whenRouteChange() {
        var matched = Router.currentRouteMatches(this.props.path);
        this.setState({matched: matched});
    }

    render() {
        if (this.state.matched) {
            var child = React.Children.only(this.props.children);
            var properties = Router.getParameters();
            return React.addons.cloneWithProps(child, properties);
        } else {
            return false;
        }
    }
}

Route.propTypes = {
    path: React.PropTypes.string,
    defaultPath: React.PropTypes.bool
};
Route.defaultProps = {
    path: ""
};