import React from "react/addons";
import _ from "lodash";
import {Input, Button, Alert, Glyphicon} from "react-bootstrap"
import Mixins from "../util/Mixins";
import SubscribeMixin from "../util/SubscribeMixin";
import AuthActions from "../auth/AuthActions";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            invalidLogin: false
        };

        this.subscribe(this.props.userStore.onInvalidLogin(this.onInvalidLogin.bind(this)));
    }

    isValidInput() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    onInvalidLogin() {
        this.setState({invalidLogin: true});
    }

    onSubmit(e) {
        e.preventDefault();
        if (!this.isValidInput()) {
            return;
        }
        this.setState({invalidLogin: false});
        AuthActions.tryCredentials(this.state.username, this.state.password);
    }

    render() {
        return (
            <form role="form" onSubmit={this.onSubmit.bind(this)}>
                <Input type="text" label="Username" valueLink={this.linkState("username")} placeholder="Username" autoComplete="username" autoFocus/>
                <Input type="password" label="Password" valueLink={this.linkState("password")} placeholder="Password" autoComplete="current-password"/>
                {this.state.invalidLogin &&
                    <Alert bsStyle="warning">
                        <Glyphicon glyph="warning-sign"/> Email or password incorrect.
                    </Alert>
                }
                <span style={{float: "right"}}><a href="#resetpassword">Forgot your password?</a></span>
                <Button bsStyle="primary" type="submit" disabled={!this.isValidInput()}>
                    Log in
                </Button>
            </form>
        );
    }
}

Mixins.add(LoginForm.prototype, [React.addons.LinkedStateMixin, SubscribeMixin]);

LoginForm.propTypes = {
    userStore: React.PropTypes.any.isRequired
};