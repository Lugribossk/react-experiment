import React from "react/addons";
import Mixins from "../../util/Mixins";

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
                    {this.props.repo}: {this.props.branch || this.props.sha || this.props.hash || this.props.commit}
                </a>
            </div>
        );
    }
}

Mixins.add(GithubLink.prototype, [React.addons.PureRenderMixin]);

GithubLink.propTypes = {
    owner: React.PropTypes.string.isRequired,
    repo: React.PropTypes.string.isRequired
};