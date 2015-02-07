import React from "react";
import Gravatar from "./Gravatar";
import "bootstrap/dist/css/bootstrap.css";
import LoginForm from "./LoginForm"

React.render(
    <div>
        <Gravatar email="example@example.com" size="40"/>
        <LoginForm/>
    </div>,
    document.querySelector("#main")
);