import React from "react";
import Application from "./app/Application.js";
import "bootstrap/dist/css/bootstrap.css";
import "ladda/dist/ladda-themeless.min.css";

import "./favicon.png";
import "./touch-icon.png";

React.render(
    <Application/>,
    document.getElementById("main")
);