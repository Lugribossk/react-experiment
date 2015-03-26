import React from "react/addons";
import _ from "lodash";
import {Input} from "react-bootstrap"
import Mixins from "../util/Mixins";
import BuildUtils from "./build/BuildUtils";
import IntegrationTestList from "./IntegrationTestList";

export default class SearchableIntegrationTestList extends React.Component {
    onChange(e) {
        window.location.hash = "search/" + encodeURIComponent(e.target.value);
    }

    filterBuilds() {
        var text = this.props.query;
        return _.filter(this.props.builds, (build) => {
            var hasName = build.getUserFullName() && _.contains(build.getUserFullName().toLocaleLowerCase(), text);
            var hasId = build.getUserId() === text.toLocaleLowerCase();
            var hasBranchOrRepo = _.some(BuildUtils.getRepoBranches(build.getParameters()), (branch, repo) => {
                var hasBranch = _.contains(branch.toLocaleLowerCase(), text);
                var hasRepo = branch !== "master" && _.contains(repo.toLocaleLowerCase(), text);
                return hasBranch || hasRepo;
            });
            var testReport = this.props.testReports[build.getId()];
            var hasTestCase = testReport && _.some(testReport.getFailedTests(), (test) => {
                return _.contains(test.file.toLocaleLowerCase(), text);
            });

            return hasName || hasId || hasBranchOrRepo || hasTestCase;
        });
    }

    render() {
        var data = {
            allBuilds: this.props.allBuilds,
            testReports: this.props.testReports,
            failureData: this.props.failureData,
            subsets: this.props.subsets
        };
        var builds = this.filterBuilds();
        return (
            <div>
                <Input type="text"
                       placeholder="Search names, branches, repos and test classes"
                       value={this.props.query}
                       onChange={this.onChange.bind(this)} autoFocus />
                <IntegrationTestList builds={builds} {...data} />
            </div>
        );
    }
}

SearchableIntegrationTestList.defaultProps = {
    query: ""
};

Mixins.add(SearchableIntegrationTestList.prototype, [React.addons.LinkedStateMixin]);
