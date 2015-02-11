import "whatwg-fetch/fetch";
import OAuth2Api from "../util/OAuth2Api";

export default class ExampleApi extends OAuth2Api {
    authenticate(username, password) {
        return this.post("/token", {
            username: username,
            password: password,
            grant_type: "password"
        })
            .catch((err) => {
                console.info("Login failed with username", username, err);
                throw err;
            })
            .then((token) => {
                this.token = token.accessToken;
                return token;
            });
    }

    getBaseUrl() {
        if (window.location.host === "localhost:8080") {
            // When developing the code and the API are served from different processes on different ports.
            return "http://localhost:9090/api";
        } else {
            // But after building they are served from one location.
            return window.location.protocol + "//" + window.location.host + "/api";
        }
    }
}