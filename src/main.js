import React from "react";
import ReactDOM from "react-dom";
import Application from "./app/Application.js";
import "bootstrap/dist/css/bootstrap.css";
import "ladda/dist/ladda-themeless.min.css";

import "./favicon.png";
import "./touch-icon.png";

ReactDOM.render(
    <Application/>,
    document.getElementById("main")
);