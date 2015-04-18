import React from "react/addons";
import _ from "lodash";
import {Input} from "react-bootstrap";
import Mixins from "../util/Mixins";
import BuildUtils from "./build/BuildUtils";
import IntegrationTestList from "./IntegrationTestList";

var setUrl = _.debounce((url) => {
    window.location.hash = "search/" + encodeURIComponent(url);
}, 300);

export default class SearchableIntegrationTestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: this.props.query
        };
    }

    onChange(e) {
        var filter = e.target.value;
        this.setState({filter: filter});
        setUrl(filter);
    }

    filterBuilds() {
        var text = this.props.query;
        return _.filter(this.props.builds, (build) => {
            var hasName = build.getUserFullName() && _.contains(build.getUserFullName().toLocaleLowerCase(), text);
            var hasId = build.getUserId() === text.toLocaleLowerCase();
            var hasBranchOrRepo = _.some(BuildUtils.getRepoBranches(build.getParameters()), (branch, repo) => {
                var hasBranch = _.contains(branch.toLocaleLowerCase(), text);
                var hasRepo = branch !== "master" && branch !== "" && _.contains(repo.toLocaleLowerCase(), text);
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
                       value={this.state.filter}
                       onChange={this.onChange.bind(this)} autoFocus />
                <IntegrationTestList builds={builds} {...data} />
            </div>
        );
    }
}

SearchableIntegrationTestList.defaultProps = {
    query: ""
};

Mixins.add(SearchableIntegrationTestList.prototype, [React.addons.LinkedStateMixin, React.addons.PureRenderMixin]);
