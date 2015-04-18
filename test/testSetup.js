/*global global*/
import jsdom from "jsdom";
import expect from "unexpected";
import unexpectedSinon from "unexpected-sinon";
import unexpectedPromise from "unexpected-promise";

global.document = jsdom.jsdom("<!doctype html><html><head></head><body></body></html>");
global.window = document.defaultView;
global.navigator = {
    userAgent: ""
};

expect.installPlugin(unexpectedSinon);
expect.installPlugin(unexpectedPromise);
