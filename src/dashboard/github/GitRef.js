export default class GitRef {
    constructor(data) {
        this.ref = data.ref;
        this.url = data.url;
        this.object = data.object;
        this.lastCommit = null;
    }

    getName() {
        return this.ref.substr(this.ref.lastIndexOf("/"));
    }
}