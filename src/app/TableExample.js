import React from "react";
import _ from "lodash";
import SortableTable from "../ui/SortableTable";

export default class TableExample extends SortableTable {
    constructor(props) {
        super(props, "name", true);
    }

    renderRow(row, query) {
        if (!query || _.contains(row.name.toLocaleLowerCase(), query.toLocaleLowerCase())) {
            return (
                <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                </tr>
            );
        }
    }

    renderHeaders() {
        return (
            <tr>
                {this.renderHeader("Name", "name", "alphabet")}
                {this.renderHeader("Email", "email")}
            </tr>
        );
    }
}
