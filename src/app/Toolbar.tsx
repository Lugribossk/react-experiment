import * as React from "react";
import {Dropdown, Menu} from "semantic-ui-react";
import {Link, NavLink} from "react-router-dom";
import User from "../auth/User";
import {logout} from "../auth/AuthActions";

interface Props {
    user: User;
}

export default class Toolbar extends React.Component<Props> {
    render() {
        const {user} = this.props;
        return (
            <Menu inverted style={{borderRadius: 0}}>
                <Menu.Item to="/" header exact="true" as={Link}>
                    Experiments
                </Menu.Item>
                <Menu.Item to="/multiple" as={NavLink}>
                    Multiple
                </Menu.Item>
                <Menu.Item to="/dynamic" as={NavLink}>
                    Dynamic
                </Menu.Item>
                <Menu.Item to="/private" as={NavLink}>
                    Private
                </Menu.Item>
                <Menu.Menu position="right">
                    <Dropdown item simple text={user.fullName}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={logout}>Log out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Menu>
            </Menu>
        );
    }
}
