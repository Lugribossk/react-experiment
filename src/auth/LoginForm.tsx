import * as React from "react";
import {login} from "./AuthActions";

interface State {
    username: string;
    password: string;
}

export default class LoginForm extends React.Component<{}, State> {
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
            <form onSubmit={e => this.handleSubmit(e)}>
                Username:{" "}
                <input type="text" value={username} onChange={e => this.setState({username: e.target.value})} />
                Password:{" "}
                <input type="password" value={password} onChange={e => this.setState({password: e.target.value})} />
                <button type="submit">Log in</button>
            </form>
        );
    }
}
