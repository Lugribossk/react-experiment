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
