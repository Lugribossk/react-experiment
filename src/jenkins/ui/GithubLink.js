import React from "react";
import _ from "lodash";

export default class GithubLink extends React.Component {
    render() {
        return (
            <div>
                <a href={"https://github.com/" + this.props.owner + "/" + this.props.repo + "/tree/" + this.props.branch} target="_blank">
                    {this.props.repo}: {this.props.branch}
                </a>
            </div>
        );
    }
}