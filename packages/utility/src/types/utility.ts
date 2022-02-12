export type EmptyArray = never[];
export type EmptyObject = Record<string, never>;
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'PUT'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type PromiseUnwrapped<T> = T extends PromiseLike<infer U>
  ? PromiseUnwrapped<U>
  : T;

export type ExtractArrays<U> = Extract<U, Array<any>>;
export type ExcludeArrays<U> = Exclude<U, Array<any>>;
export type ExtractPrimitives<U> = Extract<U, Primitive>;
export type ExcludePrimitives<U> = Exclude<U, Primitive>;

export type AnyFunction = (...args: any[]) => any;
export type Nullish = null | undefined;
export type NotNullish<T> = Exclude<T, Nullish>;
export type NotNull<T> = Exclude<T, null>;
export type Defined<T> = Exclude<T, undefined>;

/**
 * Convert any array type into its content type, while
 * preserving non-array types.
 *
 * @example
 * ```ts
 * type unwrapped = ArrayUnwrapped<string[]>; // string
 * type unwrapped = ArrayUnwrapped<string | number>; // string | number
 * type unwrapped = ArrayUnwrapped<string[] | number>; // string | number
 * ```
 */
export type ArrayUnwrapped<T> = T extends Array<infer U> ? U : T;

/**
 * The inverse of {@link ArrayUnwrapped}: convert non-array types
 * to arrays of same, while preserving array types.
 */
export type ArrayWrapped<T> = T extends any[] ? T : [T];

export type ExtractKeysByValue<Container, ValueTypeFilter> = {
  [Key in keyof Container]-?: Container[Key] extends AnyFunction
    ? ValueTypeFilter extends Container[Key]
      ? Key
      : never
    : Container[Key] extends ValueTypeFilter
    ? Key
    : never;
}[keyof Container];

export type ExcludeKeysByValue<Container, ValueTypeFilter> = Exclude<
  keyof Container,
  ExtractKeysByValue<Container, ValueTypeFilter>
>;

export type PickByValue<Container, ValueTypeFilter> = Pick<
  Container,
  ExtractKeysByValue<Container, ValueTypeFilter>
>;

export type OmitByValue<Container, ValueTypeFilter> = Omit<
  Container,
  ExtractKeysByValue<Container, ValueTypeFilter>
>;

// SPREAD (Thanks to https://stackoverflow.com/questions/49682569/typescript-merge-object-types)

type OptionalPropertyNames<T> = {
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, never | keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

export type Spread<A extends readonly [...any]> = A extends [
  infer L,
  ...infer R
]
  ? SpreadTwo<L, Spread<R>>
  : unknown;

// END SPREAD

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
export type JsonCompatible =
  | string
  | number
  | boolean
  | JsonCompatibleObject
  | JsonCompatibleArray
  | null;

// Workaround for infinite type recursion
export interface JsonCompatibleObject {
  [key: string]: JsonCompatible;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export type JsonCompatibleArray = Array<JsonCompatible>;
