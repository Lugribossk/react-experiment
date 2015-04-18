import React from "react/addons";
import ParameterDetails from "../../ui/ParameterDetails";
import RebuildButton from "./RebuildButton";
import Mixins from "../../../util/Mixins";

export default class FailedBuild extends React.Component {
    renderBuildFailures() {
        if (this.props.build.isFailed() && this.props.failureData) {
            var data = this.props.failureData;
            if (data.missingBranch) {
                if (data.missingBranchRepo) {
                    return <span>Branch {data.missingBranch} does not exist in {data.missingBranchRepo}.</span>;
                } else {
                    return <span>Branch {data.missingBranch} does not exist.</span>;
                }
            } else if (data.noFastForward) {
                return <span>Branch not up to date with master: {data.noFastForward}</span>;
            } else if (data.notBuilt) {
                return <span>Branch not built for projects: {data.notBuilt}</span>;
            }
        }

        if (this.props.build.isAborted()) {
            return <span>Build was aborted.</span>;
        }
    }

    render() {
        return (
            <div>
                <RebuildButton build={this.props.build} />
                <ParameterDetails parameters={this.props.build.getParameters()} />
                {this.renderBuildFailures()}
            </div>
        );
    }
}

Mixins.add(FailedBuild.prototype, [React.addons.PureRenderMixin]);