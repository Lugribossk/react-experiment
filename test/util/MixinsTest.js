import Mixins from "../../src/util/Mixins";

describe("Mixins", () => {
    it("should copy methods from mixin to context.", () => {
        var mixin = {
            test: function () {}
        };
        var context = {};

        Mixins.add(context, [mixin]);

        expect(context.test).toBe(mixin.test);
    });

    it("should merge React lifecycle methods with context.", () => {
        var mixin = {
            componentWillUnmount: jasmine.createSpy()
        };
        var originalContextUnmount = jasmine.createSpy();
        var context = {
            componentWillUnmount: originalContextUnmount
        };

        Mixins.add(context, [mixin]);
        context.componentWillUnmount();

        expect(mixin.componentWillUnmount).toHaveBeenCalled();
        expect(originalContextUnmount).toHaveBeenCalled();
    });

    it("should merge React lifecycle methods with multiple mixins.", () => {
        var mixin1 = {
            componentWillUnmount: jasmine.createSpy()
        };
        var mixin2 = {
            componentWillUnmount: jasmine.createSpy()
        };
        var context = {};

        Mixins.add(context, [mixin1, mixin2]);
        context.componentWillUnmount();

        expect(mixin1.componentWillUnmount).toHaveBeenCalled();
        expect(mixin2.componentWillUnmount).toHaveBeenCalled();
    });
});