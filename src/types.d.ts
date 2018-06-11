declare interface Dictionary<T> {
    [key: string]: T;
}

declare interface ReadonlyDictionary<T> {
    readonly [key: string]: T;
}

declare type Opaque<K, T> = T & {__type__: K};

declare module "*.json" {
    const value: any;
    export = value;
}

declare module "*.png" {
    const value: string;
    export = value;
}

declare module "*.svg" {
    const value: string;
    export = value;
}
