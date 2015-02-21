export default class Commit {
    constructor(data) {
        this.sha = data.sha;
        this.url = data.url;
        this.author = data.author;
        this.comitter = data.comitter;
        this.message = data.message;
        this.tree = data.tree;
        this.parents = data.parents;
    }
}