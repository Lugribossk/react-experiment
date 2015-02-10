import Action from "../src/experimental/Action";

describe("Action", () => {
    it("should call listeners when triggered.", () => {
        var action = new Action("test1");
        var listener = jasmine.createSpy();

        action.onDispatch(listener);

        action("test");

        expect(listener).toHaveBeenCalledWith("test");
    });

    it("should not call listeners that have been removed.", () => {
        var action = new Action("test2");
        var listener = jasmine.createSpy();

        var remove = action.onDispatch(listener);
        remove();

        action();

        expect(listener).not.toHaveBeenCalled();
    });

    it("should share dispatching across different instances with the same name.", () => {
        var action1 = new Action("test3");
        var action2 = new Action("test3");
        var listener = jasmine.createSpy();

        action1.onDispatch(listener);

        action2("test");

        expect(listener).toHaveBeenCalledWith("test");
    });
});