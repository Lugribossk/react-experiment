import React from "react";
import StatusDashboard from "./status/StatusDashboard";
import "bootstrap/dist/css/bootstrap.css";
import "ladda/dist/ladda-themeless.min.css";

import "./favicon.png";
import "./touch-icon.png";

React.render(
    <StatusDashboard/>,
    document.getElementById("main")
);