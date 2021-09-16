export declare function isObject(val: unknown): boolean;
export declare type MinusKeys<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
export declare type Defined<T> = T extends undefined ? never : T;
export declare type MergedProperties<T, U> = {
  [K in keyof T & keyof U]: undefined extends T[K]
    ? Defined<T[K] | U[K]>
    : T[K];
};
declare type O = {
  [index: string]: unknown;
};
export declare function mergeDeep<T extends O, S extends O>(
  target: T,
  source: S
): O;
export {};
