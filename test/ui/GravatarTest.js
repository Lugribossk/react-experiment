import React from "react";
import expect from "expect.js";
import Gravatar from "../../src/ui/Gravatar";
import TestUtils from "../TestUtils";

describe("Gravatar", () => {
    TestUtils.setupTestDom();

    var gravatar, img;
    beforeEach(() => {
        gravatar = TestUtils.React.renderIntoDocument(
            <Gravatar email="MyEmailAddress@example.com" size="40"/>
        );
        img = React.findDOMNode(gravatar);
    });

    it("should show Gravatar image.", () => {
        expect(img.src).to.contain("gravatar.com/avatar/0bc83cb571cd1c50ba6f3e8a78ef1346");
    });

    it("should use HTTPS.", () => {
        expect(img.src).to.contain("https://secure.gravatar.com");
    });
});