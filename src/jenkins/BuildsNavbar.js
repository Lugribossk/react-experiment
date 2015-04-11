import React from "react";
import {Navbar, Nav, NavItem, CollapsableNav, Button, Badge, ModalTrigger} from "react-bootstrap";
import TriggerIntegrationTest from "./TriggerIntegrationTest";

export default class BuildsNavbar extends React.Component {
    isActive(link) {
        return this.props.router.currentRouteMatches(link);
    }

    render() {
        return (
            <Navbar brand="ITs" toggleNavKey={0} fluid>
                <CollapsableNav eventKey={0}>
                    <Nav navbar>
                        <NavItem href="#" active={this.isActive("")}>
                            All <Badge>{this.props.all}</Badge>
                        </NavItem>
                        <NavItem href="#failed" active={this.isActive("failed")}>
                            Failed <Badge>{this.props.failed}</Badge>
                        </NavItem>
                        <NavItem href="#unstable" active={this.isActive("unstable")}>
                            Unstable <Badge>{this.props.unstable}</Badge>
                        </NavItem>
                        <NavItem href="#success" active={this.isActive("success")}>
                            Succeeded <Badge>{this.props.success}</Badge>
                        </NavItem>
                        <NavItem href="#mine" active={this.isActive("mine")}>
                            Mine <Badge>{this.props.mine}</Badge>
                        </NavItem>
                        <NavItem href="#lastnight" active={this.isActive("lastnight")}>
                            Last night
                        </NavItem>
                        <NavItem href="#search/" active={this.isActive("search")}>
                            Search
                        </NavItem>
                        <NavItem href="#stats" active={this.isActive("stats")}>
                            Stats
                        </NavItem>
                        <NavItem href="#nodes" active={this.isActive("nodes")}>
                            Nodes <Badge className={this.props.totalNodes < 24 && "alert-danger"}>{this.props.totalNodes}</Badge>
                        </NavItem>
                    </Nav>
                    <ul>
                        <ModalTrigger modal={<TriggerIntegrationTest />}>
                            <Button className="navbar-btn navbar-right" bsStyle="primary">
                                Start IT run
                            </Button>
                        </ModalTrigger>
                    </ul>
                </CollapsableNav>
            </Navbar>
        );
    }
}
