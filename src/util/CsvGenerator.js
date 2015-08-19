import _ from "lodash";

export default class CsvGenerator {
    constructor(separator = ";", excel = true) {
        this.separator = separator;
        this.excel = excel;
        this.lines = [];
    }

    fromTableData(headers, data) {
        this.lines = _.map(data, item => {
            return _.map(headers, header => item[header.key]);
        });

        this.lines.unshift(_.map(headers, header => header.label));

        return this;
    }

    generate() {
        var joinedLines = _.map(this.lines, line => {
            var escapedLine = _.map(line, item => {
                var escapedItem = item;
                if (_.contains(item, "\"")) {
                    escapedItem = item.replace(/"/g, "\"\"");
                }
                if (_.contains(item, this.separator) || _.contains(item, "\"") || _.contains(item, "\n")) {
                    escapedItem = "\"" + item + "\"";
                }
                return escapedItem;
            });
            return escapedLine.join(this.separator);
        });

        if (this.excel) {
            joinedLines.unshift("sep=" + this.separator);
        }

        return joinedLines.join("\n");
    }

    generateDataUri() {
        var data = this.generate();
        return "data:text/csv;charset=utf-8," + encodeURIComponent(data);
    }
}