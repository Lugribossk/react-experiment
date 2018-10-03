import * as React from "react";
import {Menu} from "semantic-ui-react";
import {shallow} from "enzyme";
import User from "../../src/auth/User";
import Toolbar from "../../src/app/Toolbar";
import {NavLink} from "react-router-dom";

test("should link to error page", () => {
    const user = new User({
        fullName: "Test"
    });

    const wrapper = shallow(<Toolbar user={user} />);

    expect(wrapper).toContainReact(
        <Menu.Item to="/error" as={NavLink}>
            Error
        </Menu.Item>
    );
});
