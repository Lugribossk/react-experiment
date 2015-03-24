import React from "react/addons";
import _ from "lodash";
import Router from "./Router";

/**
 * Component for conditionally rendering the child component based on the current hash fragment route.
 * Parameters can be extracted from the route and automatically set as props on the child component.
 *
 * @param {String} path The path the hash fragment should be on to display the child component.
 * E.g. path="test" will render when the url is "http://example.com#test".
 * Parameters are encoded as ":name", e.g. path="test/:id", which will render and set the "id" prop to "12345" when the url is "http://example.com#test/12345".
 * @param {Boolean} [defaultPath=false] Whether this is the default route.
 * If no other route matches, this route is navigated to automatically.
 *
 * The routes are only active when the Route component is mounted.
 * Must have only one child component.
 * A Router instance must be created before rendering any Route components.
 */
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
    path: "",
    defaultPath: false
};