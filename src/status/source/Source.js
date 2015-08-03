import Promise from "bluebird";

export default class Source {
    constructor(data) {
        this.title = data.title;
        this.interval = data.interval || 60;
    }

    getInterval() {
        return this.interval;
    }

    getStatus() {
        return Promise.resolve({
            title: this.title,
            link: "http://example.com",
            status: "success",
            messages: [{
                name: "Example",
                detailName: "Example",
                message: "Example"
            }]
        });
    }
}

Source.type = "";