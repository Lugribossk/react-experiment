import React from "react/addons";
import _ from "lodash";
import ParameterDetails from "../../ui/ParameterDetails";
import RebuildButton from "./RebuildButton";
import Mixins from "../../../util/Mixins";

export default class UnstableBuild extends React.Component {
    renderTestFailures() {
        if (this.props.testReport && this.props.testReport.failCount > 10) {
            return <span>{this.props.testReport.failCount} tests failed.</span>;
        }

        if (this.props.testReport && this.props.testReport.failCount > 0) {
            return _.map(this.props.testReport.getFailedTests(), (failure) => {
                var key = this.props.build.getId() + failure.file + failure.name;
                key = key.replace(/ /g, "-").replace(/\./g, "-");

                var pack = failure.file.substr(0, failure.file.lastIndexOf("."));
                var klass = failure.file.substr(failure.file.lastIndexOf(".") + 1);
                var name = failure.name.replace(/[ \.\[\]-]/g, "_");
                var link = this.props.build.url + "testReport/junit/" + pack + "/" + klass + "/" + name;

                return (
                    <div key={key}>
                        <a href={link} target="_blank" className="text-warning">{klass}: {failure.name}</a>;
                    </div>
                );
            });
        }
    }

    renderSubsetFailures() {
        if (this.props.subsets) {
            var failedSubsets = _.filter(this.props.subsets, (subset) => {
                return !subset.building && !subset.isSuccess();
            });

            if (failedSubsets.length > 0 && (!this.props.testReport || this.props.testReport.failCount < failedSubsets.length)) {
                return (
                    <span>
                        Failed subsets:
                        {_.map(failedSubsets, (subset) => {
                            return <a key={subset.getId()} href={subset.url} target="_blank"> {subset.getId()}</a>;
                        })}
                    </span>
                );
            }
        }
        if (!this.props.testReport || this.props.testReport.failCount === 0) {
            return <span>Unstable with 0 failed tests, but subset information is no longer available.</span>;
        }
    }

    render() {
        return (
            <div>
                <RebuildButton build={this.props.build} />
                <ParameterDetails parameters={this.props.build.getParameters()} />
                {this.renderTestFailures()}
                {this.renderSubsetFailures()}
            </div>
        );
    }
}

Mixins.add(UnstableBuild.prototype, [React.addons.PureRenderMixin]);
