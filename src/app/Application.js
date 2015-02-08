import React from "react";
import Promise from "bluebird";
import "bootstrap/dist/css/bootstrap.css";
import ExampleNavbar from "./ExampleNavbar"
import ExampleRouter from "./ExampleRouter";
import LoginForm from "../auth/LoginForm"
import CurrentUserStore from "../auth/CurrentUserStore";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../util/SubscribeMixin";

export default class Application extends React.Component {
    constructor(props) {
        super(props);
        this.currentUserStore = new CurrentUserStore();
        this.state = {
            user: this.currentUserStore.getUser(),
            route: "",
            stuff: null
        };

        this.subscribe(this.currentUserStore.onUserChange(this.onUserChange.bind(this)));
    }

    onUserChange(user) {
        this.setState({user: user});
    }

    componentDidMount() {
        var x = (stuff) => {
            this.setState({stuff: stuff});
        };
        var router = new ExampleRouter(x, this.currentUserStore);

        this.setState({route: router.fragment.get()});
        router.on("match", (event) => {
            this.setState({route: event.value});
        });
    }

    logout() {
        this.currentUserStore.logout();
    }

    render () {
        if (this.state.user) {
            return (
                <div>
                    <ExampleNavbar {...this.state.user} route={this.state.route} onLogout={this.logout} />
                    <div className="container" ref="content">
                        {this.state.stuff}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container">
                    <LoginForm userStore={this.currentUserStore}/>
                </div>
            );
        }
    }
}

Mixins.add(Application.prototype, [SubscribeMixin]);