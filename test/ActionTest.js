import Action from "../src/experimental/Action";

describe("Action", () => {
    it("should call listeners when triggered.", () => {
        var action = new Action();
        var listener = jasmine.createSpy();

        action.onTrigger(listener);

        action("test");

        expect(listener).toHaveBeenCalledWith("test");
    });

    it("should not call listeners that have been removed.", () => {
        var action = new Action();
        var listener = jasmine.createSpy();

        var remove = action.onTrigger(listener);
        remove();

        action();

        expect(listener).not.toHaveBeenCalled();
    });
});