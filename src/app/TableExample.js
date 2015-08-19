import React from "react";
import SortableTable from "../ui/SortableTable";

export default class TableExample extends React.Component {
    render() {
        var headers = [{
            label: "Name",
            key: "name",
            type: "alphabet"
        }, {
            label: "Email",
            key: "email"
        }];
        var data = [{name: "Test", email: "test@example.com"}, {name: "Atest", email: "blah@example.com"}, {name: "Xtest", email: "btest@example.com"}, {name: "abc", email: "sdfsdfs"}];

        return (
            <SortableTable headers={headers} data={data} />
        );
    }
}
