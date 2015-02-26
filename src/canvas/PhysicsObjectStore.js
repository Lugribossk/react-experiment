

export default class PhysicsObjectStore extends Store {
    constructor(tickStore) {
        super();

        this.state = {
            blah: []
        };
    }

    onTick(elapsed) {
        _.forEach(this.state.blah, (blah) => {

        });
    }
}