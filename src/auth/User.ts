export default class User {
    readonly name: string;
    readonly email: string;

    constructor(data: any) {
        this.name = data.name;
        this.email = data.email;
    }
}
