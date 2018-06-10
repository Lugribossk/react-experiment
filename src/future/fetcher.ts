import * as Promise from "bluebird";

const withoutReactErrorLogging = <T>(promise: Promise<T>) => {
    // Hidden React feature to not log the usual componentDidCatch() error message.
    (promise as any).suppressReactErrorLogging = true;
    return promise;
};

interface PromiseFactory<Arg, Val> {
    (arg: Arg): Promise<Val>
}

const factoryCache: Map<PromiseFactory<any, any>, Map<any, Promise<any>>> = new Map();

export class Fetcher<Arg, Val> {
    private readonly factory: PromiseFactory<Arg, Val>;

    constructor(factory: PromiseFactory<Arg, Val>) {
        if (factoryCache.has(factory)) {
            throw new Error("Already created");
        }
        factoryCache.set(factory, new Map());
        this.factory = factory;
    }

    /**
     * @throws Promise
     */
    read(arg: Arg): Val {
        const promise = this.promise(arg);

        if (promise.isFulfilled()) {
            return promise.value();
        }
        throw promise;
    }

    promise(arg: Arg): Promise<Val> {
        const argCache = factoryCache.get(this.factory)!;
        if (argCache.has(arg)) {
            return argCache.get(arg)!;
        }

        const promise = withoutReactErrorLogging(this.factory(arg));
        argCache.set(arg, promise);
        return promise;
    }
}

export const createFetcher = <ArgType, ValueType>(factory: PromiseFactory<ArgType, ValueType>): Fetcher<ArgType, ValueType> => {
    return new Fetcher(factory);
};

export const waitFor = (...promises: Promise<any>[]) => {
    if (promises.some(p => p.isPending())) {
        throw withoutReactErrorLogging(Promise.all(promises));
    }
};
