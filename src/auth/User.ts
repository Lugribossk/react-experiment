export default class User {
    readonly fullName: string;
    readonly email: string;

    constructor(data: any) {
        this.fullName = data.fullName;
        this.email = data.email;
    }
}
