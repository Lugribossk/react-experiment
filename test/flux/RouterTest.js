import expect from "expect.js";
import sinon from "sinon";
import Router from "../../src/flux/Router";

describe("Router", () => {
    var mockWindow;
    var hashChangeHandler;
    beforeEach(() => {
        mockWindow = {
            addEventListener: (event, handler) => {
                hashChangeHandler = handler;
            },
            location: {
                href: "",
                hash: ""
            }
        }
    });
    var changeHash = (newHash) => {
        mockWindow.location.href = "http://example.com/#" + newHash;
        mockWindow.location.hash = newHash;
        hashChangeHandler({newURL: mockWindow.location.href});
    };

    describe("extractors", () => {
        describe("for simple path", () => {
            it("should accept same path.", () => {
                var extractor = Router.createExtractor("test");
                var result = extractor("test");

                expect(result).to.be.ok();
            });

            it("should reject different path.", () => {
                var extractor = Router.createExtractor("test");
                var result = extractor("nottest");

                expect(result).not.to.be.ok();
            });
        });

        describe("for path with one parameter", () => {
            it("should extract parameter.", () => {
                var extractor = Router.createExtractor("test/:id");
                var result = extractor("test/12345");

                expect(result).to.be.ok();
                expect(result.id).to.be("12345");
            });

            it("should reject different path", () => {
                var extractor = Router.createExtractor("test/:id");
                var result = extractor("nottest/12345");

                expect(result).not.to.be.ok();
            });
        });

        describe("for path with multiple parameters", () => {
            it("should extract all parameters.", () => {
                var extractor = Router.createExtractor("test/:id/:type");
                var result = extractor("test/12345/demo");

                expect(result).to.be.ok();
                expect(result.id).to.be("12345");
                expect(result.type).to.be("demo");
            });
        });
    });

    describe("routing", () => {
        it("should route to simple path.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "test");

            changeHash("test");

            expect(router.currentRouteMatches("test")).to.be(true);
            expect(router.currentRouteMatches("nottest")).to.be(false);
        });

        it("should route to path with parameters and extract them.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "test/:id");

            changeHash("test/12345");

            expect(router.getParameters()).to.be.ok();
            expect(router.getParameters().id).to.be("12345");
        });

        it("should change hash to default path when no route matches.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "test", true);

            changeHash("nottest");

            expect(mockWindow.location.hash).to.be("test "); // extra space
        });

        it("should route to empty path.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "");

            changeHash("");

            expect(router.currentRouteMatches("")).to.be(true);
            expect(router.currentRouteMatches("nottest")).to.be(false);
        });
    });

    describe("route matching", () => {
        it("should match beginning of route.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "test/:id");

            changeHash("test/12345");

            expect(router.currentRouteMatches("test")).to.be(true);
            expect(router.currentRouteMatches("test/12345")).to.be(true);
            expect(router.currentRouteMatches("")).to.be(false);
        });

        it("should match empty string with empty path.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "");

            changeHash("");

            expect(router.currentRouteMatches("")).to.be(true);
            expect(router.currentRouteMatches("test")).to.be(false);
        });

        it("should match path with parameters.", () => {
            var router = new Router(mockWindow);
            router.register(() => {}, "test/:id");

            changeHash("test/12345");

            expect(router.currentRouteMatches("test/:id")).to.be(true);
        });
    });

    describe("event listener", () => {
        it("should be called when route matches.", () => {
            var router = new Router(mockWindow);
            var listener = sinon.spy();
            router.register(listener, "test");

            changeHash("test");

            expect(listener.called).to.be.ok();
        });

        it("should not be called when no route matches.", () => {
            var router = new Router(mockWindow);
            var listener = sinon.spy();
            router.register(listener, "test");

            changeHash("nottest");

            expect(listener.called).not.to.be.ok();
        });
    });
});