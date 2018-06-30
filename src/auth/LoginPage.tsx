import * as React from "react";
import {login} from "./AuthActions";
import {Grid, Segment, Form, Button} from "semantic-ui-react";

interface State {
    username: string;
    password: string;
}

export default class LoginPage extends React.Component<{}, State> {
    constructor(props: {}) {
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
        const {username, password} = this.state;
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

                            <Button primary fluid size="large">
                                Login
                            </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }
}
