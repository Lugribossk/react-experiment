import Promise from "bluebird";
import {valueOrThrow} from "../../src/suspense/suspense";

test("should return value from resolved promise", () => {
    expect(valueOrThrow(Promise.resolve("test"))).toBe("test");
});

test("should throw on rejected promise", () => {
    expect(() => valueOrThrow(Promise.reject(new Error()))).toThrow();
});

test("should throw on pending promise", () => {
    expect(() => valueOrThrow(new Promise<void>(() => {}))).toThrow();
});
