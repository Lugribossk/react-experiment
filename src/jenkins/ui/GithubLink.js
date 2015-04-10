import React from "react";
import _ from "lodash";

export default class GithubLink extends React.Component {
    render() {
        var url = "https://github.com/" + this.props.owner + "/" + this.props.repo;
        if (this.props.branch) {
            url += "/tree/" + this.props.branch;
        } else if (this.props.sha || this.props.hash || this.props.commit) {
            url += "/commit/" + (this.props.sha || this.props.hash || this.props.commit);
        }

        return (
            <div>
                <a href={url} target="_blank">
                    {this.props.repo}: {this.props.branch}
                </a>
            </div>
        );
    }
}
