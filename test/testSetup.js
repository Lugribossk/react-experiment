/*global global*/
import jsdom from "jsdom";

global.document = jsdom.jsdom("<!doctype html><html><head></head><body></body></html>");
global.window = document.defaultView;
global.navigator = {
    userAgent: ""
};