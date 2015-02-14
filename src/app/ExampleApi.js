import "whatwg-fetch/fetch";
import OAuth2Api from "../util/OAuth2Api";

export default class ExampleApi extends OAuth2Api {
    authenticateWith(token) {
        this.token = token;
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