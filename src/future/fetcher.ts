import * as Promise from "bluebird";

interface PromiseFactory<ArgType, ValueType> {
    (arg: ArgType): Promise<ValueType>
}

interface Fetcher<ArgType, ValueType> {
    /**
     * @throws Promise
     */
    read(arg: ArgType): ValueType
}

const factoryCache: Map<PromiseFactory<any, any>, Map<any, Promise<any>>> = new Map();

export const createFetcher = <ArgType, ValueType>(factory: PromiseFactory<ArgType, ValueType>): Fetcher<ArgType, ValueType> => {
    if (factoryCache.has(factory)) {
        throw new Error("Already created");
    }
    factoryCache.set(factory, new Map());
    return {
        read(arg) {
            const argCache = factoryCache.get(factory)!;
            if (!argCache.has(arg)) {
                const promise = factory(arg);
                // Hidden React feature to not log the usual componentDidCatch() error message.
                (promise as any).suppressReactErrorLogging = true;
                argCache.set(arg, promise);
            }
            const promise = argCache.get(arg)!;

            if (promise.isFulfilled()) {
                return promise.value();
            }
            throw promise;
        }
    }
};

