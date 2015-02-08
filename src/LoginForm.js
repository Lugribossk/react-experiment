import React from "react/addons";
import _ from "lodash";
import {Input, Button, Alert, Glyphicon} from "react-bootstrap"

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            invalidLogin: false
        };

        // TODO This only allows a single mixin.
        _.assign(this, React.addons.LinkedStateMixin);
    }

    valid() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    onSubmit(e) {
        e.preventDefault();
        if (!this.valid()) {
            return;
        }
        this.setState({invalidLogin: false});
        this.props.tryCredentials(this.state.username, this.state.password)
            .catch(() => {
                this.setState({invalidLogin: true});
            });
    }

    render() {
        return (
            <form role="form" onSubmit={this.onSubmit.bind(this)}>
                <Input type="text" label="Username" valueLink={this.linkState("username")}/>
                <Input type="password" label="Password" valueLink={this.linkState("password")}/>
                {this.state.invalidLogin &&
                    <Alert bsStyle="warning">
                        <Glyphicon glyph="warning-sign"/> Email or password incorrect.
                    </Alert>
                }
                <span style={{float: "right"}}><a href="#resetpassword">Forgot your password?</a></span>
                <Button bsStyle="primary" type="submit" disabled={!this.valid()}>
                    Log in
                </Button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    tryCredentials: React.PropTypes.func.isRequired
};