import Router from "../../src/util/route/Router";

xdescribe("Router", () => {
    var mockWindow;
    beforeEach(() => {
        mockWindow = {
            addEventListener: jasmine.createSpy(),
            location: {
                href: ""
            }
        }
    });

    it("should ...", () => {
        var handler = jasmine.createSpy();
        var router = new Router(mockWindow);
        router.add("test", handler);
        router.init();

        var x = mockWindow.addEventListener.calls.first().args[1];
        x("test");

        expect(handler).toHaveBeenCalled();
    });
});