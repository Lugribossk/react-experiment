import React from "react/addons";
import _ from "lodash";
import {Table, Glyphicon} from "react-bootstrap";
import Mixins from "../util/Mixins";

export default class SortableTable extends React.Component {
    constructor(props) {
        super(props);
        var sortKey = this.props.initialSortKey;
        if (!sortKey) {
            sortKey = this.props.headers[0].key;
        }

        this.state = {
            sortKey: sortKey,
            sortAscending: true
        };
    }

    renderHeaders() {
        return _.map(this.props.headers, header => {
            var changeSorting = () => {
                if (this.state.sortKey === header.key) {
                    this.setState({sortAscending: !this.state.sortAscending});
                } else {
                    this.setState({sortKey: header.key});
                }
            };

            var sortIcon = null;
            var sortType = header.type || "attributes";
            if (this.state.sortKey === header.key) {
                sortIcon = (
                    <Glyphicon glyph={"sort-by-" + sortType + (this.state.sortAscending ? "" : "-alt")} />
                );
            } else {
                sortIcon = <Glyphicon glyph="cog" style={{visibility: "hidden"}} />;
            }

            return (
                <th key={header.key}>
                    <span onClick={changeSorting} style={{WebkitUserSelect: "none", cursor: "pointer"}}>
                        {header.label} {sortIcon}
                    </span>
                </th>
            );
        });
    }

    renderRows() {
        var sortedRows = _.sortByOrder(this.props.data, [this.state.sortKey], [this.state.sortAscending]);

        return _.map(sortedRows, row => {
            return (
                <tr key={row.id || row[this.props.headers[0].key]}>
                    {_.map(this.props.headers, header => {
                        return (
                            <td key={header.key}>
                                {row[header.key]}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    }

    render() {
        return (
            <div>
                <Table striped hover>
                    <thead>
                        {this.renderHeaders()}
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </Table>
            </div>
        );
    }
}

Mixins.add(SortableTable.prototype, [React.addons.PureRenderMixin]);

SortableTable.propTypes = {
    data: React.PropTypes.array.isRequired,
    headers: React.PropTypes.array.isRequired
};
