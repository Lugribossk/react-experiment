import React from "react";
import _ from "lodash";
import moment from "moment";
import {Panel} from "react-bootstrap"
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";

export default class UnstableStats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testReports: this.props.buildsStore.getTestReports()
        };

        this.subscribe(this.props.buildsStore.onTestReportsChanged(this.onTestReportsChanged.bind(this)));
    }

    onTestReportsChanged(reports) {
        this.setState({testReports: reports});
    }

    blah(getKey) {
        var count = {};
        _.forEach(this.state.testReports, (report) => {
            _.forEach(report.getFailingTests(), (failure) => {
                var key = getKey(failure);
                if (key) {
                    if (count[key]) {
                        count[key] = count[key] + 1;
                    } else {
                        count[key] = 1;
                    }
                }
            });
        });
        var failList = _.map(count, (count, name) => {
            return {name: name, count: count};
        });
        var sorted = failList.sort((a, b) => {
            var x = b.count - a.count;
            if (x !== 0) {
                return x;
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        var interesting = sorted;/*_.filter(sorted, (item) => {
            return item.count > 1;
        });*/

        return interesting;
    }

    renderTests() {
        var x = this.blah((failure) => {
            return failure.file + " " + failure.name;
        });

        return _.map(x, (item) => {
            return (
                <div key={item.name}>
                    {item.name}: {item.count}
                </div>
            )
        });
    }

    renderSlaves() {
        var x = this.blah((failure) => {
            return failure.slave;
        });

        return _.map(x, (item) => {
            return (
                <div key={item.name}>
                    <a href={"/computer/slave-" + item.name} target="_blank">{item.name}</a>: {item.count}
                </div>
            )
        });
    }

    render() {
        return (
            <div>
                <Panel header="Unstable by test">
                    {this.renderTests()}
                </Panel>
                <Panel header="Unstable by slave">
                    {this.renderSlaves()}
                </Panel>
            </div>
        );
    }
}

Mixins.add(UnstableStats.prototype, [SubscribeMixin]);
