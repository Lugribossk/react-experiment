import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import LoginForm from "./LoginForm"
import ExampleNavbar from "./ExampleNavbar"

export default class Application extends React.Component {
    render () {
        return (
            <div>
                <ExampleNavbar name="Test" email="example@example.com" onLogout={() => {}}/>
                <div className="container">
                    <LoginForm tryCredentials={() => {}}/>
                </div>
            </div>
        );
    }
}