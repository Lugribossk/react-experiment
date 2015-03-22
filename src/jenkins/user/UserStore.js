import request from "superagent-bluebird-promise";
import CachingStore from "../../flux/CachingStore";

export default class UserStore extends CachingStore {
    constructor() {
        super(__filename);
        this.state = this.getCachedState() || {
            currentUser: null
        };

        this._updateCurrentUser();
    }

    onCurrentUserChanged(listener) {
        return this._registerListener("currentUser", listener);
    }

    getCurrentUser() {
        return this.state.currentUser;
    }

    _updateCurrentUser() {
        request.get("/me/api/json")
            .query("tree=id,fullName,property[address]")
            .then((result) => {
                var email = null;
                _.forEach(result.body.property, (prop) => {
                    if (prop.address) {
                        email = prop.address;
                    }
                });

                this.setState({currentUser: {
                    id: result.body.id,
                    name: result.body.fullName,
                    email: email
                }});
            })
            .catch((err) => {});
    }
}