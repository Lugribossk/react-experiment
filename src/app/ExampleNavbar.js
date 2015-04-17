import React from "react";
import {Navbar, Nav, NavItem, DropdownButton, MenuItem} from "react-bootstrap"
import Gravatar from "../ui/Gravatar";
import AuthActions from "../auth/AuthActions";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";

/**
 * Example navigation bar.
 */
export default class ExampleNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            routeMatcher: this.props.router.getCurrentRouteMatcher()
        };
        this.subscribe(this.props.router.onRouteChange(this.whenRouteChanged.bind(this)));
    }

    whenRouteChanged() {
        this.setState({routeMatcher: this.props.router.getCurrentRouteMatcher()});
    }

    isActive(link) {
        return this.state.routeMatcher(link);
    }

    render () {
        var currentUser = (
            <span>
                <Gravatar email={this.props.email} size={30}/>
                <span> {this.props.name}</span>
            </span>
        );

        return (
            <Navbar brand="Example" fluid>
                <Nav>
                    <NavItem href="#" active={this.isActive("")}>Dashboard</NavItem>
                    <NavItem href="#test1" active={this.isActive("test1")}>Test 1</NavItem>
                    <NavItem href="#test2/12345" active={this.isActive("test2")}>Test 2</NavItem>
                </Nav>
                <Nav right={true}>
                    <DropdownButton title={currentUser}>
                        <MenuItem href="#profile">Profile</MenuItem>
                        <MenuItem divider />
                        <MenuItem onSelect={AuthActions.logout}>Log out</MenuItem>
                    </DropdownButton>
                </Nav>
            </Navbar>
        );
    }
}

ExampleNavbar.propTypes = {
    email: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    router: React.PropTypes.any.isRequired
};

Mixins.add(ExampleNavbar.prototype, [SubscribeMixin]);