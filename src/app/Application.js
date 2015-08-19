import React from "react";
import ExampleNavbar from "./ExampleNavbar";
import LoginForm from "../auth/LoginForm";
import CurrentUserStore from "../auth/CurrentUserStore";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";
import ExampleApi from "./ExampleApi";
import Route from "../flux/Route";
import Test2Page from "./Test2Page";
import TableExample from "./TableExample";

/**
 * The example application itself.
 */
export default class Application extends React.Component {
    constructor(props) {
        super(props);
        var api = new ExampleApi();
        this.currentUserStore = new CurrentUserStore(api);

        this.state = {
            user: this.currentUserStore.getUser()
        };

        this.subscribe(this.currentUserStore.onUserChange(this.whenUserChanged.bind(this)));
    }

    whenUserChanged() {
        this.setState({user: this.currentUserStore.getUser()});
    }

    render() {
        var tableData = [{name: "Test", email: "test@example.com"}, {name: "Atest", email: "blah@example.com"}, {name: "Xtest", email: "btest@example.com"}];
        if (this.state.user) {
            return (
                <div>
                    <ExampleNavbar {...this.state.user} router={Route.getRouter()} />
                    <div className="container">
                        <Route path="test1">
                            <div>
                                <h1>Test 1</h1>
                                <TableExample data={tableData} />
                            </div>
                        </Route>
                        <Route path="test2/:id">
                            <Test2Page />
                        </Route>
                        <Route defaultPath>
                            <h1>Dashboard</h1>
                        </Route>
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
