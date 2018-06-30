import * as React from "react";
import {login} from "./AuthActions";
import {Grid, Segment, Form, Button, Message} from "semantic-ui-react";
import {LoginAttempt} from "./CurrentUserStore";

interface Props {
    loginAttempt: LoginAttempt;
}

interface State {
    username: string;
    password: string;
}

export default class LoginPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    handleSubmit(e: React.FormEvent<any>) {
        const {username, password} = this.state;
        e.preventDefault();
        login(username, password);
    }

    render() {
        const {loginAttempt} = this.props;
        const {username, password} = this.state;
        const loading = loginAttempt === "loading";
        const failed = loginAttempt === "failed";

        return (
            <Grid textAlign="center" style={{height: "100%"}} verticalAlign="middle">
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size="large" onSubmit={e => this.handleSubmit(e)}>
                        <Segment>
                            <Form.Input
                                fluid
                                icon="at"
                                iconPosition="left"
                                placeholder="E-mail address"
                                value={username}
                                onChange={(e, {value}) => this.setState({username: value})}
                                autoComplete="username"
                                autoFocus
                                autoCorrect="off"
                                autoCapitalize="none"
                            />
                            <Form.Input
                                fluid
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e, {value}) => this.setState({password: value})}
                                autoComplete="current-password"
                            />

                            <Button primary fluid size="large" loading={loading} disabled={loading}>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    {failed && <Message warning>Username or password incorrect. Please try again.</Message>}
                </Grid.Column>
            </Grid>
        );
    }
}
