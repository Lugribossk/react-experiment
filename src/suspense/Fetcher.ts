import * as Promise from "bluebird";
import {valueOrThrow} from "./suspense";

interface PromiseFactory<Arg, Val> {
    (arg: Arg): Promise<Val>;
}

export default class Fetcher<Arg, Val> {
    private readonly factory: PromiseFactory<Arg, Val>;
    private readonly cache: Map<Arg, Promise<Val>>;

    constructor(factory: PromiseFactory<Arg, Val>) {
        this.factory = factory;
        this.cache = new Map();
    }

    /**
     * @throws Promise
     */
    read(arg: Arg): Val {
        return valueOrThrow(this.promise(arg));
    }

    promise(arg: Arg): Promise<Val> {
        if (this.cache.has(arg)) {
            return this.cache.get(arg)!;
        }

        const promise = this.factory(arg);
        this.cache.set(arg, promise);
        return promise;
    }
}

export const createFetcher = <Arg, Val>(factory: PromiseFactory<Arg, Val>): Fetcher<Arg, Val> => {
    return new Fetcher(factory);
};

export class ImportFetcher<Module> {
    private readonly factory: () => PromiseLike<Module>;
    private cache: Promise<any> | undefined;

    constructor(importFactory: () => PromiseLike<Module>) {
        this.factory = importFactory;
    }

    read(): Module {
        return valueOrThrow(this.promise());
    }

    promise() {
        if (this.cache) {
            return this.cache;
        }
        const promise = Promise.resolve(this.factory());
        this.cache = promise;
        return promise;
    }
}

const importFetcherCache = new Map<() => PromiseLike<any>, ImportFetcher<any>>();

export const createImportFetcher = <Module>(importFactory: () => PromiseLike<Module>): ImportFetcher<Module> => {
    // Why does this work? The callback with the import() statement should be a new object on each call (even if it
    // imports the same file), so the cache will never be hit. And yet it does work and hit the cache, while a straight
    // new ImportFetcher() does not...
    if (importFetcherCache.has(importFactory)) {
        return importFetcherCache.get(importFactory)!;
    }
    const fetcher = new ImportFetcher(importFactory);
    importFetcherCache.set(importFactory, fetcher);
    return fetcher;
};
