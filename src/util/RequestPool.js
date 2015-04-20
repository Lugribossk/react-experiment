import Promise from "bluebird";

export default class RequestPool {
    constructor(maxConcurrent=1) {
        this.maxConcurrent = maxConcurrent;
        this.running = 0;
        this.queue = [];
    }

    add(request) {
        var deferred = RequestPool._deferred(request);
        this.queue.push({
            request: request,
            deferred: deferred
        });
        this._startNext();
        return deferred.promise;
    }

    _startNext() {
        if (this.running < this.maxConcurrent && this.queue.length > 0) {
            this.running = this.running + 1;
            var next = this.queue.shift();

            next.request.promise()
                .finally(() => {
                    this.running = this.running - 1;
                    this._startNext();
                })
                .then(next.deferred.resolve)
                .catch(next.deferred.reject);
        }
    }

    static _deferred(request) {
        var resolve, reject;
        var promise = new Promise(function (a, b) {
            resolve = a;
            reject = b;
        })
            .cancellable()
            .catch(Promise.CancellationError, function (err) {
                request.abort();
                throw err;
            });

        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    };
}