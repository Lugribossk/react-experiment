import React from "react/addons";
import _ from "lodash";
import {Table, Glyphicon, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import Mixins from "../util/Mixins";
import CsvGenerator from "../util/CsvGenerator";

export default class SortableTable extends React.Component {
    constructor(props) {
        super(props);
        var sortKey = this.props.initialSortKey;
        if (!sortKey) {
            sortKey = this.props.headers[0].key;
        }

        this.state = {
            sortKey: sortKey,
            sortAscending: this.props.initialSortAscending
        };
    }

    getSortedData() {
        return _.sortByOrder(this.props.data, [this.state.sortKey], [this.state.sortAscending]);
    }

    renderCsvButton() {
        if (!this.props.csvName) {
            return null;
        }
        var downloadCsv = () => {
            var csvData = new CsvGenerator().fromTableData(this.props.headers, this.getSortedData()).generateDataUri();
            var link = document.createElement("a");
            link.download = this.props.csvName + ".csv";
            link.href = csvData;
            link.click();
        };
        return (
            <OverlayTrigger placement="top" overlay={<Tooltip>Download displayed data as CSV</Tooltip>}>
                <Button bsSize="xsmall" className="pull-right" onClick={downloadCsv}>
                    <Glyphicon glyph="save" />
                </Button>
            </OverlayTrigger>
        );
    }

    renderHeaders() {
        return _.map(this.props.headers, (header, index) => {
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
                // alphabet, order, attributes
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
                    {this.props.headers.length - 1 === index &&
                        this.renderCsvButton()}
                </th>
            );
        });
    }

    renderRows() {
        return _.map(this.getSortedData(), item => {
            return (
                <tr key={item.id || item[this.props.headers[0].key]}>
                    {_.map(this.props.headers, header => {
                        var value = header.getValue ? header.getValue(item) : item[header.key];
                        return (
                            <td key={header.key}>
                                {value}
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
    headers: React.PropTypes.array.isRequired,
    csvName: React.PropTypes.string,
    initialSortAscending: React.PropTypes.bool
};

SortableTable.defaultProps = {
    csvName: "",
    initialSortAscending: true
};
