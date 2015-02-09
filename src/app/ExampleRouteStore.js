
export default class ExampleRouteStore extends AuthenticatingRouteStore {
    constructor(userStore) {
        super(userStore);

        this.get("test1", () => {
            this.show(<h1>Test 1</h1>);
        });
        this.get("test2/:id", (req) => {
            this.show(<h1>Test 2 - {req.params.id}</h1>);
        });
        this.get("", () => {
            this.show(<h1>Dashboard</h1>);
        });
        this.get("*", (r, event) => {
            if (!event.parent()) {
                this.navigate("");
            }
        });
    }
}