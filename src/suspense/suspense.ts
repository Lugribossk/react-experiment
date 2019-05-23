import Promise from "bluebird";

export const withoutReactErrorLogging = <T>(promise: Promise<T>) => {
    // Hidden React feature to not log the usual componentDidCatch() error message.
    (promise as any)._suppressLogging = true;
    return promise;
};

export const valueOrThrow = <T>(promise: Promise<T>) => {
    if (promise.isRejected()) {
        throw promise.reason();
    }
    if (promise.isResolved()) {
        return promise.value();
    }
    throw withoutReactErrorLogging(promise);
};

export const waitFor = (...promises: Promise<any>[]) => {
    if (promises.some(p => p.isPending())) {
        throw withoutReactErrorLogging(Promise.all(promises));
    }
};
