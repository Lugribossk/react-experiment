import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import LoginForm from "./LoginForm"
import ExampleNavbar from "./ExampleNavbar"
import Promise from "bluebird";
import ExampleRouter from "./ExampleRouter";

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            route: ""
        }
    }

    componentDidMount() {
        var me = this;
        var authController = {
            tryCredentials: function (username, password) {
                // TODO send to server
                if (password === "t") {
                    me.setState({user: {
                        name: "Test Testsen",
                        email: "example@example.com"
                    }});
                    return Promise.resolve();
                } else {
                    return Promise.reject();
                }
            },
            attemptLogin: function () {
                // TODO try saved credentials
                return new Promise((resolve, reject) => {
                    var x = (username, password) => {
                        return authController.tryCredentials(username, password)
                            .then(resolve);
                    };
                    React.render(
                        <LoginForm tryCredentials={x}/>,
                        me.refs.content.getDOMNode()
                    );
                });
            },
            getCurrentUser: function () {
                return me.state.user;
            }
        };

        var router = new ExampleRouter(this.refs.content.getDOMNode(), authController);

        this.setState({route: router.fragment.get()});
        router.on("match", (event) => {
            this.setState({route: event.value});
        });
    }

    render () {
        return (
            <div>
                {this.state.user &&
                    <ExampleNavbar {...this.state.user} route={this.state.route} onLogout={() => {}} />
                }
                <div className="container" ref="content">
                </div>
            </div>
        );
    }
}