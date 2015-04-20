import expect from "unexpected";
import RequestPool from "../../src/util/RequestPool";
import Promise from "bluebird";

function createRequest() {
    var resolve, reject;
    var promise = new Promise(function (a, b) {
        resolve = a;
        reject = b;
    });

    return {
        promise: () => {
            return promise;
        },
        resolve: resolve,
        reject: reject
    };
}

describe("RequestPool", () => {
    it("return value should resolve when request resolves.", (done) => {
        var pool = new RequestPool(1);
        var request = createRequest();

        pool.add(request)
            .then((data) => {
                expect(data, "to be", "test");
                done();
            });

        request.resolve("test");
    });
});