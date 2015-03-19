import jsdom from "jsdom";
import React from "react/addons";

export default {
    setupTestDom: function () {
        beforeEach(() => {
            global.document = jsdom.jsdom("<!doctype html><html><head></head><body></body></html>");
            global.window = document.defaultView;
            global.navigator = {
                userAgent: ""
            };
        });

        afterEach(() => {
            global.window.close();
            global.document = null;
        });
    },

    React: React.addons.TestUtils
}