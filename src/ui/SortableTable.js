import React from "react/addons";
import _ from "lodash";
import {Table, Glyphicon, Input} from "react-bootstrap";
import Mixins from "../util/Mixins";
import SubscribeMixin from "../flux/SubscribeMixin";

export default class SortableTable extends React.Component {
    constructor(props, initialSortKey, searchEnabled) {
        super(props);
        this.state = {
            sortKey: initialSortKey,
            sortAscending: true,
            searchEnabled: !!searchEnabled,
            searchQuery: ""
        };
    }

    getRows() {
        var data = this.props.data;
        return _.sortByOrder(data, [this.state.sortKey], [this.state.sortAscending]);
    }

    renderHeader(label, key, type = "attributes") {
        var changeSorting = () => {
            if (this.state.sortKey === key) {
                this.setState({sortAscending: !this.state.sortAscending});
            } else {
                this.setState({sortKey: key});
            }
        };

        var sortIcon = null;
        if (this.state.sortKey === key) {
            sortIcon = (
                <Glyphicon style={{float: "right"}}
                           glyph={"sort-by-" + type + (this.state.sortAscending ? "" : "-alt")} />
            );
        }

        return (
            <th key={label}
                style={{"-webkitUserSelect": "none", cursor: "pointer"}}
                onClick={changeSorting}>
                {label}
                {sortIcon}
            </th>
        );
    }

    renderRow() {}

    renderHeaders() {}

    render() {
        return (
            <div>
                {this.state.searchEnabled &&
                    <Input type="text"
                           placeholder="Search"
                           addonBefore={<Glyphicon glyph="search" />}
                           valueLink={this.linkState("searchQuery")} />}
                <Table striped bordered {...this.props}>
                    <thead>
                        {this.renderHeaders()}
                    </thead>
                    <tbody>
                        {_.map(this.getRows(), (row) => {
                            return this.renderRow(row, this.state.searchQuery);
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

Mixins.add(SortableTable.prototype, [React.addons.LinkedStateMixin, SubscribeMixin]);

SortableTable.propTypes = {
    data: React.PropTypes.any.isRequired
};
