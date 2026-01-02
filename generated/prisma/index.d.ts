
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model EmailOtp
 * 
 */
export type EmailOtp = $Result.DefaultSelection<Prisma.$EmailOtpPayload>
/**
 * Model Vendor
 * 
 */
export type Vendor = $Result.DefaultSelection<Prisma.$VendorPayload>
/**
 * Model ProductType
 * 
 */
export type ProductType = $Result.DefaultSelection<Prisma.$ProductTypePayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Product
 * 
 */
export type Product = $Result.DefaultSelection<Prisma.$ProductPayload>
/**
 * Model ProductVariant
 * 
 */
export type ProductVariant = $Result.DefaultSelection<Prisma.$ProductVariantPayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model ReferralLog
 * 
 */
export type ReferralLog = $Result.DefaultSelection<Prisma.$ReferralLogPayload>
/**
 * Model ReferralEarningsLog
 * 
 */
export type ReferralEarningsLog = $Result.DefaultSelection<Prisma.$ReferralEarningsLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  PARTNER: 'PARTNER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.emailOtp`: Exposes CRUD operations for the **EmailOtp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailOtps
    * const emailOtps = await prisma.emailOtp.findMany()
    * ```
    */
  get emailOtp(): Prisma.EmailOtpDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vendor`: Exposes CRUD operations for the **Vendor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vendors
    * const vendors = await prisma.vendor.findMany()
    * ```
    */
  get vendor(): Prisma.VendorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productType`: Exposes CRUD operations for the **ProductType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductTypes
    * const productTypes = await prisma.productType.findMany()
    * ```
    */
  get productType(): Prisma.ProductTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.product`: Exposes CRUD operations for the **Product** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Products
    * const products = await prisma.product.findMany()
    * ```
    */
  get product(): Prisma.ProductDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productVariant`: Exposes CRUD operations for the **ProductVariant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductVariants
    * const productVariants = await prisma.productVariant.findMany()
    * ```
    */
  get productVariant(): Prisma.ProductVariantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.referralLog`: Exposes CRUD operations for the **ReferralLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReferralLogs
    * const referralLogs = await prisma.referralLog.findMany()
    * ```
    */
  get referralLog(): Prisma.ReferralLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.referralEarningsLog`: Exposes CRUD operations for the **ReferralEarningsLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReferralEarningsLogs
    * const referralEarningsLogs = await prisma.referralEarningsLog.findMany()
    * ```
    */
  get referralEarningsLog(): Prisma.ReferralEarningsLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    EmailOtp: 'EmailOtp',
    Vendor: 'Vendor',
    ProductType: 'ProductType',
    Category: 'Category',
    Product: 'Product',
    ProductVariant: 'ProductVariant',
    Tag: 'Tag',
    ReferralLog: 'ReferralLog',
    ReferralEarningsLog: 'ReferralEarningsLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "emailOtp" | "vendor" | "productType" | "category" | "product" | "productVariant" | "tag" | "referralLog" | "referralEarningsLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      EmailOtp: {
        payload: Prisma.$EmailOtpPayload<ExtArgs>
        fields: Prisma.EmailOtpFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailOtpFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailOtpFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          findFirst: {
            args: Prisma.EmailOtpFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailOtpFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          findMany: {
            args: Prisma.EmailOtpFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>[]
          }
          create: {
            args: Prisma.EmailOtpCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          createMany: {
            args: Prisma.EmailOtpCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailOtpCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>[]
          }
          delete: {
            args: Prisma.EmailOtpDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          update: {
            args: Prisma.EmailOtpUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          deleteMany: {
            args: Prisma.EmailOtpDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailOtpUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmailOtpUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>[]
          }
          upsert: {
            args: Prisma.EmailOtpUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailOtpPayload>
          }
          aggregate: {
            args: Prisma.EmailOtpAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailOtp>
          }
          groupBy: {
            args: Prisma.EmailOtpGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailOtpGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailOtpCountArgs<ExtArgs>
            result: $Utils.Optional<EmailOtpCountAggregateOutputType> | number
          }
        }
      }
      Vendor: {
        payload: Prisma.$VendorPayload<ExtArgs>
        fields: Prisma.VendorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VendorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VendorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findFirst: {
            args: Prisma.VendorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VendorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          findMany: {
            args: Prisma.VendorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          create: {
            args: Prisma.VendorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          createMany: {
            args: Prisma.VendorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VendorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          delete: {
            args: Prisma.VendorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          update: {
            args: Prisma.VendorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          deleteMany: {
            args: Prisma.VendorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VendorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VendorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>[]
          }
          upsert: {
            args: Prisma.VendorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VendorPayload>
          }
          aggregate: {
            args: Prisma.VendorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVendor>
          }
          groupBy: {
            args: Prisma.VendorGroupByArgs<ExtArgs>
            result: $Utils.Optional<VendorGroupByOutputType>[]
          }
          count: {
            args: Prisma.VendorCountArgs<ExtArgs>
            result: $Utils.Optional<VendorCountAggregateOutputType> | number
          }
        }
      }
      ProductType: {
        payload: Prisma.$ProductTypePayload<ExtArgs>
        fields: Prisma.ProductTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          findFirst: {
            args: Prisma.ProductTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          findMany: {
            args: Prisma.ProductTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>[]
          }
          create: {
            args: Prisma.ProductTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          createMany: {
            args: Prisma.ProductTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>[]
          }
          delete: {
            args: Prisma.ProductTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          update: {
            args: Prisma.ProductTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          deleteMany: {
            args: Prisma.ProductTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>[]
          }
          upsert: {
            args: Prisma.ProductTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductTypePayload>
          }
          aggregate: {
            args: Prisma.ProductTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductType>
          }
          groupBy: {
            args: Prisma.ProductTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductTypeCountArgs<ExtArgs>
            result: $Utils.Optional<ProductTypeCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Product: {
        payload: Prisma.$ProductPayload<ExtArgs>
        fields: Prisma.ProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findFirst: {
            args: Prisma.ProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          findMany: {
            args: Prisma.ProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          create: {
            args: Prisma.ProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          createMany: {
            args: Prisma.ProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          delete: {
            args: Prisma.ProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          update: {
            args: Prisma.ProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          deleteMany: {
            args: Prisma.ProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>[]
          }
          upsert: {
            args: Prisma.ProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductPayload>
          }
          aggregate: {
            args: Prisma.ProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduct>
          }
          groupBy: {
            args: Prisma.ProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductCountArgs<ExtArgs>
            result: $Utils.Optional<ProductCountAggregateOutputType> | number
          }
        }
      }
      ProductVariant: {
        payload: Prisma.$ProductVariantPayload<ExtArgs>
        fields: Prisma.ProductVariantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductVariantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductVariantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          findFirst: {
            args: Prisma.ProductVariantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductVariantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          findMany: {
            args: Prisma.ProductVariantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          create: {
            args: Prisma.ProductVariantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          createMany: {
            args: Prisma.ProductVariantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductVariantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          delete: {
            args: Prisma.ProductVariantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          update: {
            args: Prisma.ProductVariantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          deleteMany: {
            args: Prisma.ProductVariantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductVariantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductVariantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>[]
          }
          upsert: {
            args: Prisma.ProductVariantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductVariantPayload>
          }
          aggregate: {
            args: Prisma.ProductVariantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductVariant>
          }
          groupBy: {
            args: Prisma.ProductVariantGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductVariantGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductVariantCountArgs<ExtArgs>
            result: $Utils.Optional<ProductVariantCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      ReferralLog: {
        payload: Prisma.$ReferralLogPayload<ExtArgs>
        fields: Prisma.ReferralLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReferralLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReferralLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          findFirst: {
            args: Prisma.ReferralLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReferralLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          findMany: {
            args: Prisma.ReferralLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>[]
          }
          create: {
            args: Prisma.ReferralLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          createMany: {
            args: Prisma.ReferralLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReferralLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>[]
          }
          delete: {
            args: Prisma.ReferralLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          update: {
            args: Prisma.ReferralLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          deleteMany: {
            args: Prisma.ReferralLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReferralLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReferralLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>[]
          }
          upsert: {
            args: Prisma.ReferralLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralLogPayload>
          }
          aggregate: {
            args: Prisma.ReferralLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReferralLog>
          }
          groupBy: {
            args: Prisma.ReferralLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReferralLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReferralLogCountArgs<ExtArgs>
            result: $Utils.Optional<ReferralLogCountAggregateOutputType> | number
          }
        }
      }
      ReferralEarningsLog: {
        payload: Prisma.$ReferralEarningsLogPayload<ExtArgs>
        fields: Prisma.ReferralEarningsLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReferralEarningsLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReferralEarningsLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          findFirst: {
            args: Prisma.ReferralEarningsLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReferralEarningsLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          findMany: {
            args: Prisma.ReferralEarningsLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>[]
          }
          create: {
            args: Prisma.ReferralEarningsLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          createMany: {
            args: Prisma.ReferralEarningsLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReferralEarningsLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>[]
          }
          delete: {
            args: Prisma.ReferralEarningsLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          update: {
            args: Prisma.ReferralEarningsLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          deleteMany: {
            args: Prisma.ReferralEarningsLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReferralEarningsLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReferralEarningsLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>[]
          }
          upsert: {
            args: Prisma.ReferralEarningsLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReferralEarningsLogPayload>
          }
          aggregate: {
            args: Prisma.ReferralEarningsLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReferralEarningsLog>
          }
          groupBy: {
            args: Prisma.ReferralEarningsLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReferralEarningsLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReferralEarningsLogCountArgs<ExtArgs>
            result: $Utils.Optional<ReferralEarningsLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    emailOtp?: EmailOtpOmit
    vendor?: VendorOmit
    productType?: ProductTypeOmit
    category?: CategoryOmit
    product?: ProductOmit
    productVariant?: ProductVariantOmit
    tag?: TagOmit
    referralLog?: ReferralLogOmit
    referralEarningsLog?: ReferralEarningsLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    referredUsers: number
    referralLogsUsed: number
    referralLogsReceived: number
    referralEarningsGenerated: number
    referralEarningsReceived: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    referredUsers?: boolean | UserCountOutputTypeCountReferredUsersArgs
    referralLogsUsed?: boolean | UserCountOutputTypeCountReferralLogsUsedArgs
    referralLogsReceived?: boolean | UserCountOutputTypeCountReferralLogsReceivedArgs
    referralEarningsGenerated?: boolean | UserCountOutputTypeCountReferralEarningsGeneratedArgs
    referralEarningsReceived?: boolean | UserCountOutputTypeCountReferralEarningsReceivedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReferredUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReferralLogsUsedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReferralLogsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReferralEarningsGeneratedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralEarningsLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReferralEarningsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralEarningsLogWhereInput
  }


  /**
   * Count Type VendorCountOutputType
   */

  export type VendorCountOutputType = {
    products: number
  }

  export type VendorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | VendorCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VendorCountOutputType
     */
    select?: VendorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VendorCountOutputType without action
   */
  export type VendorCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductTypeCountOutputType
   */

  export type ProductTypeCountOutputType = {
    products: number
  }

  export type ProductTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | ProductTypeCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * ProductTypeCountOutputType without action
   */
  export type ProductTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductTypeCountOutputType
     */
    select?: ProductTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductTypeCountOutputType without action
   */
  export type ProductTypeCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    products: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | CategoryCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Count Type ProductCountOutputType
   */

  export type ProductCountOutputType = {
    variants: number
  }

  export type ProductCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    variants?: boolean | ProductCountOutputTypeCountVariantsArgs
  }

  // Custom InputTypes
  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductCountOutputType
     */
    select?: ProductCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductCountOutputType without action
   */
  export type ProductCountOutputTypeCountVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductVariantWhereInput
  }


  /**
   * Count Type ProductVariantCountOutputType
   */

  export type ProductVariantCountOutputType = {
    childVariants: number
  }

  export type ProductVariantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    childVariants?: boolean | ProductVariantCountOutputTypeCountChildVariantsArgs
  }

  // Custom InputTypes
  /**
   * ProductVariantCountOutputType without action
   */
  export type ProductVariantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariantCountOutputType
     */
    select?: ProductVariantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductVariantCountOutputType without action
   */
  export type ProductVariantCountOutputTypeCountChildVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductVariantWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    products: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | TagCountOutputTypeCountProductsArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountProductsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    referrerId: number | null
    totalReferralEarnings: Decimal | null
    withdrawableBalance: Decimal | null
    totalReferredUsers: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    referrerId: number | null
    totalReferralEarnings: Decimal | null
    withdrawableBalance: Decimal | null
    totalReferredUsers: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    role: $Enums.UserRole | null
    referralCode: string | null
    referrerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
    totalReferralEarnings: Decimal | null
    withdrawableBalance: Decimal | null
    totalReferredUsers: number | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    role: $Enums.UserRole | null
    referralCode: string | null
    referrerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
    totalReferralEarnings: Decimal | null
    withdrawableBalance: Decimal | null
    totalReferredUsers: number | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    role: number
    referralCode: number
    referrerId: number
    createdAt: number
    updatedAt: number
    enabled: number
    totalReferralEarnings: number
    withdrawableBalance: number
    totalReferredUsers: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    referrerId?: true
    totalReferralEarnings?: true
    withdrawableBalance?: true
    totalReferredUsers?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    referrerId?: true
    totalReferralEarnings?: true
    withdrawableBalance?: true
    totalReferredUsers?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    referralCode?: true
    referrerId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    totalReferralEarnings?: true
    withdrawableBalance?: true
    totalReferredUsers?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    referralCode?: true
    referrerId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    totalReferralEarnings?: true
    withdrawableBalance?: true
    totalReferredUsers?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    role?: true
    referralCode?: true
    referrerId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    totalReferralEarnings?: true
    withdrawableBalance?: true
    totalReferredUsers?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string | null
    email: string
    role: $Enums.UserRole
    referralCode: string
    referrerId: number | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    totalReferralEarnings: Decimal
    withdrawableBalance: Decimal
    totalReferredUsers: number
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    referralCode?: boolean
    referrerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    totalReferralEarnings?: boolean
    withdrawableBalance?: boolean
    totalReferredUsers?: boolean
    referrer?: boolean | User$referrerArgs<ExtArgs>
    referredUsers?: boolean | User$referredUsersArgs<ExtArgs>
    referralLogsUsed?: boolean | User$referralLogsUsedArgs<ExtArgs>
    referralLogsReceived?: boolean | User$referralLogsReceivedArgs<ExtArgs>
    referralEarningsGenerated?: boolean | User$referralEarningsGeneratedArgs<ExtArgs>
    referralEarningsReceived?: boolean | User$referralEarningsReceivedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    referralCode?: boolean
    referrerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    totalReferralEarnings?: boolean
    withdrawableBalance?: boolean
    totalReferredUsers?: boolean
    referrer?: boolean | User$referrerArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    referralCode?: boolean
    referrerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    totalReferralEarnings?: boolean
    withdrawableBalance?: boolean
    totalReferredUsers?: boolean
    referrer?: boolean | User$referrerArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    referralCode?: boolean
    referrerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    totalReferralEarnings?: boolean
    withdrawableBalance?: boolean
    totalReferredUsers?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "role" | "referralCode" | "referrerId" | "createdAt" | "updatedAt" | "enabled" | "totalReferralEarnings" | "withdrawableBalance" | "totalReferredUsers", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    referrer?: boolean | User$referrerArgs<ExtArgs>
    referredUsers?: boolean | User$referredUsersArgs<ExtArgs>
    referralLogsUsed?: boolean | User$referralLogsUsedArgs<ExtArgs>
    referralLogsReceived?: boolean | User$referralLogsReceivedArgs<ExtArgs>
    referralEarningsGenerated?: boolean | User$referralEarningsGeneratedArgs<ExtArgs>
    referralEarningsReceived?: boolean | User$referralEarningsReceivedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    referrer?: boolean | User$referrerArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    referrer?: boolean | User$referrerArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      referrer: Prisma.$UserPayload<ExtArgs> | null
      referredUsers: Prisma.$UserPayload<ExtArgs>[]
      referralLogsUsed: Prisma.$ReferralLogPayload<ExtArgs>[]
      referralLogsReceived: Prisma.$ReferralLogPayload<ExtArgs>[]
      referralEarningsGenerated: Prisma.$ReferralEarningsLogPayload<ExtArgs>[]
      referralEarningsReceived: Prisma.$ReferralEarningsLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      email: string
      role: $Enums.UserRole
      referralCode: string
      referrerId: number | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
      totalReferralEarnings: Prisma.Decimal
      withdrawableBalance: Prisma.Decimal
      totalReferredUsers: number
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    referrer<T extends User$referrerArgs<ExtArgs> = {}>(args?: Subset<T, User$referrerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    referredUsers<T extends User$referredUsersArgs<ExtArgs> = {}>(args?: Subset<T, User$referredUsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    referralLogsUsed<T extends User$referralLogsUsedArgs<ExtArgs> = {}>(args?: Subset<T, User$referralLogsUsedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    referralLogsReceived<T extends User$referralLogsReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$referralLogsReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    referralEarningsGenerated<T extends User$referralEarningsGeneratedArgs<ExtArgs> = {}>(args?: Subset<T, User$referralEarningsGeneratedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    referralEarningsReceived<T extends User$referralEarningsReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$referralEarningsReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly referralCode: FieldRef<"User", 'String'>
    readonly referrerId: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly enabled: FieldRef<"User", 'Boolean'>
    readonly totalReferralEarnings: FieldRef<"User", 'Decimal'>
    readonly withdrawableBalance: FieldRef<"User", 'Decimal'>
    readonly totalReferredUsers: FieldRef<"User", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.referrer
   */
  export type User$referrerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * User.referredUsers
   */
  export type User$referredUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User.referralLogsUsed
   */
  export type User$referralLogsUsedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    where?: ReferralLogWhereInput
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    cursor?: ReferralLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReferralLogScalarFieldEnum | ReferralLogScalarFieldEnum[]
  }

  /**
   * User.referralLogsReceived
   */
  export type User$referralLogsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    where?: ReferralLogWhereInput
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    cursor?: ReferralLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReferralLogScalarFieldEnum | ReferralLogScalarFieldEnum[]
  }

  /**
   * User.referralEarningsGenerated
   */
  export type User$referralEarningsGeneratedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    where?: ReferralEarningsLogWhereInput
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    cursor?: ReferralEarningsLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReferralEarningsLogScalarFieldEnum | ReferralEarningsLogScalarFieldEnum[]
  }

  /**
   * User.referralEarningsReceived
   */
  export type User$referralEarningsReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    where?: ReferralEarningsLogWhereInput
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    cursor?: ReferralEarningsLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReferralEarningsLogScalarFieldEnum | ReferralEarningsLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model EmailOtp
   */

  export type AggregateEmailOtp = {
    _count: EmailOtpCountAggregateOutputType | null
    _avg: EmailOtpAvgAggregateOutputType | null
    _sum: EmailOtpSumAggregateOutputType | null
    _min: EmailOtpMinAggregateOutputType | null
    _max: EmailOtpMaxAggregateOutputType | null
  }

  export type EmailOtpAvgAggregateOutputType = {
    id: number | null
    wrongAttempts: number | null
    resendCount: number | null
  }

  export type EmailOtpSumAggregateOutputType = {
    id: number | null
    wrongAttempts: number | null
    resendCount: number | null
  }

  export type EmailOtpMinAggregateOutputType = {
    id: number | null
    email: string | null
    otp: string | null
    expiresAt: Date | null
    wrongAttempts: number | null
    blockedUntil: Date | null
    resendCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type EmailOtpMaxAggregateOutputType = {
    id: number | null
    email: string | null
    otp: string | null
    expiresAt: Date | null
    wrongAttempts: number | null
    blockedUntil: Date | null
    resendCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type EmailOtpCountAggregateOutputType = {
    id: number
    email: number
    otp: number
    expiresAt: number
    wrongAttempts: number
    blockedUntil: number
    resendCount: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type EmailOtpAvgAggregateInputType = {
    id?: true
    wrongAttempts?: true
    resendCount?: true
  }

  export type EmailOtpSumAggregateInputType = {
    id?: true
    wrongAttempts?: true
    resendCount?: true
  }

  export type EmailOtpMinAggregateInputType = {
    id?: true
    email?: true
    otp?: true
    expiresAt?: true
    wrongAttempts?: true
    blockedUntil?: true
    resendCount?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type EmailOtpMaxAggregateInputType = {
    id?: true
    email?: true
    otp?: true
    expiresAt?: true
    wrongAttempts?: true
    blockedUntil?: true
    resendCount?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type EmailOtpCountAggregateInputType = {
    id?: true
    email?: true
    otp?: true
    expiresAt?: true
    wrongAttempts?: true
    blockedUntil?: true
    resendCount?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type EmailOtpAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailOtp to aggregate.
     */
    where?: EmailOtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailOtps to fetch.
     */
    orderBy?: EmailOtpOrderByWithRelationInput | EmailOtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailOtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailOtps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailOtps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailOtps
    **/
    _count?: true | EmailOtpCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EmailOtpAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EmailOtpSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailOtpMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailOtpMaxAggregateInputType
  }

  export type GetEmailOtpAggregateType<T extends EmailOtpAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailOtp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailOtp[P]>
      : GetScalarType<T[P], AggregateEmailOtp[P]>
  }




  export type EmailOtpGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailOtpWhereInput
    orderBy?: EmailOtpOrderByWithAggregationInput | EmailOtpOrderByWithAggregationInput[]
    by: EmailOtpScalarFieldEnum[] | EmailOtpScalarFieldEnum
    having?: EmailOtpScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailOtpCountAggregateInputType | true
    _avg?: EmailOtpAvgAggregateInputType
    _sum?: EmailOtpSumAggregateInputType
    _min?: EmailOtpMinAggregateInputType
    _max?: EmailOtpMaxAggregateInputType
  }

  export type EmailOtpGroupByOutputType = {
    id: number
    email: string
    otp: string
    expiresAt: Date
    wrongAttempts: number
    blockedUntil: Date | null
    resendCount: number
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: EmailOtpCountAggregateOutputType | null
    _avg: EmailOtpAvgAggregateOutputType | null
    _sum: EmailOtpSumAggregateOutputType | null
    _min: EmailOtpMinAggregateOutputType | null
    _max: EmailOtpMaxAggregateOutputType | null
  }

  type GetEmailOtpGroupByPayload<T extends EmailOtpGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailOtpGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailOtpGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailOtpGroupByOutputType[P]>
            : GetScalarType<T[P], EmailOtpGroupByOutputType[P]>
        }
      >
    >


  export type EmailOtpSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    otp?: boolean
    expiresAt?: boolean
    wrongAttempts?: boolean
    blockedUntil?: boolean
    resendCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["emailOtp"]>

  export type EmailOtpSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    otp?: boolean
    expiresAt?: boolean
    wrongAttempts?: boolean
    blockedUntil?: boolean
    resendCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["emailOtp"]>

  export type EmailOtpSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    otp?: boolean
    expiresAt?: boolean
    wrongAttempts?: boolean
    blockedUntil?: boolean
    resendCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["emailOtp"]>

  export type EmailOtpSelectScalar = {
    id?: boolean
    email?: boolean
    otp?: boolean
    expiresAt?: boolean
    wrongAttempts?: boolean
    blockedUntil?: boolean
    resendCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type EmailOtpOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "otp" | "expiresAt" | "wrongAttempts" | "blockedUntil" | "resendCount" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["emailOtp"]>

  export type $EmailOtpPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailOtp"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      otp: string
      expiresAt: Date
      wrongAttempts: number
      blockedUntil: Date | null
      resendCount: number
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["emailOtp"]>
    composites: {}
  }

  type EmailOtpGetPayload<S extends boolean | null | undefined | EmailOtpDefaultArgs> = $Result.GetResult<Prisma.$EmailOtpPayload, S>

  type EmailOtpCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmailOtpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmailOtpCountAggregateInputType | true
    }

  export interface EmailOtpDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailOtp'], meta: { name: 'EmailOtp' } }
    /**
     * Find zero or one EmailOtp that matches the filter.
     * @param {EmailOtpFindUniqueArgs} args - Arguments to find a EmailOtp
     * @example
     * // Get one EmailOtp
     * const emailOtp = await prisma.emailOtp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailOtpFindUniqueArgs>(args: SelectSubset<T, EmailOtpFindUniqueArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmailOtp that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailOtpFindUniqueOrThrowArgs} args - Arguments to find a EmailOtp
     * @example
     * // Get one EmailOtp
     * const emailOtp = await prisma.emailOtp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailOtpFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailOtpFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailOtp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpFindFirstArgs} args - Arguments to find a EmailOtp
     * @example
     * // Get one EmailOtp
     * const emailOtp = await prisma.emailOtp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailOtpFindFirstArgs>(args?: SelectSubset<T, EmailOtpFindFirstArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailOtp that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpFindFirstOrThrowArgs} args - Arguments to find a EmailOtp
     * @example
     * // Get one EmailOtp
     * const emailOtp = await prisma.emailOtp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailOtpFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailOtpFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmailOtps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailOtps
     * const emailOtps = await prisma.emailOtp.findMany()
     * 
     * // Get first 10 EmailOtps
     * const emailOtps = await prisma.emailOtp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailOtpWithIdOnly = await prisma.emailOtp.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailOtpFindManyArgs>(args?: SelectSubset<T, EmailOtpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmailOtp.
     * @param {EmailOtpCreateArgs} args - Arguments to create a EmailOtp.
     * @example
     * // Create one EmailOtp
     * const EmailOtp = await prisma.emailOtp.create({
     *   data: {
     *     // ... data to create a EmailOtp
     *   }
     * })
     * 
     */
    create<T extends EmailOtpCreateArgs>(args: SelectSubset<T, EmailOtpCreateArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmailOtps.
     * @param {EmailOtpCreateManyArgs} args - Arguments to create many EmailOtps.
     * @example
     * // Create many EmailOtps
     * const emailOtp = await prisma.emailOtp.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailOtpCreateManyArgs>(args?: SelectSubset<T, EmailOtpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailOtps and returns the data saved in the database.
     * @param {EmailOtpCreateManyAndReturnArgs} args - Arguments to create many EmailOtps.
     * @example
     * // Create many EmailOtps
     * const emailOtp = await prisma.emailOtp.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailOtps and only return the `id`
     * const emailOtpWithIdOnly = await prisma.emailOtp.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailOtpCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailOtpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmailOtp.
     * @param {EmailOtpDeleteArgs} args - Arguments to delete one EmailOtp.
     * @example
     * // Delete one EmailOtp
     * const EmailOtp = await prisma.emailOtp.delete({
     *   where: {
     *     // ... filter to delete one EmailOtp
     *   }
     * })
     * 
     */
    delete<T extends EmailOtpDeleteArgs>(args: SelectSubset<T, EmailOtpDeleteArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmailOtp.
     * @param {EmailOtpUpdateArgs} args - Arguments to update one EmailOtp.
     * @example
     * // Update one EmailOtp
     * const emailOtp = await prisma.emailOtp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailOtpUpdateArgs>(args: SelectSubset<T, EmailOtpUpdateArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmailOtps.
     * @param {EmailOtpDeleteManyArgs} args - Arguments to filter EmailOtps to delete.
     * @example
     * // Delete a few EmailOtps
     * const { count } = await prisma.emailOtp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailOtpDeleteManyArgs>(args?: SelectSubset<T, EmailOtpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailOtps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailOtps
     * const emailOtp = await prisma.emailOtp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailOtpUpdateManyArgs>(args: SelectSubset<T, EmailOtpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailOtps and returns the data updated in the database.
     * @param {EmailOtpUpdateManyAndReturnArgs} args - Arguments to update many EmailOtps.
     * @example
     * // Update many EmailOtps
     * const emailOtp = await prisma.emailOtp.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmailOtps and only return the `id`
     * const emailOtpWithIdOnly = await prisma.emailOtp.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EmailOtpUpdateManyAndReturnArgs>(args: SelectSubset<T, EmailOtpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmailOtp.
     * @param {EmailOtpUpsertArgs} args - Arguments to update or create a EmailOtp.
     * @example
     * // Update or create a EmailOtp
     * const emailOtp = await prisma.emailOtp.upsert({
     *   create: {
     *     // ... data to create a EmailOtp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailOtp we want to update
     *   }
     * })
     */
    upsert<T extends EmailOtpUpsertArgs>(args: SelectSubset<T, EmailOtpUpsertArgs<ExtArgs>>): Prisma__EmailOtpClient<$Result.GetResult<Prisma.$EmailOtpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmailOtps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpCountArgs} args - Arguments to filter EmailOtps to count.
     * @example
     * // Count the number of EmailOtps
     * const count = await prisma.emailOtp.count({
     *   where: {
     *     // ... the filter for the EmailOtps we want to count
     *   }
     * })
    **/
    count<T extends EmailOtpCountArgs>(
      args?: Subset<T, EmailOtpCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailOtpCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailOtp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EmailOtpAggregateArgs>(args: Subset<T, EmailOtpAggregateArgs>): Prisma.PrismaPromise<GetEmailOtpAggregateType<T>>

    /**
     * Group by EmailOtp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailOtpGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EmailOtpGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailOtpGroupByArgs['orderBy'] }
        : { orderBy?: EmailOtpGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EmailOtpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailOtpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailOtp model
   */
  readonly fields: EmailOtpFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailOtp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailOtpClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EmailOtp model
   */
  interface EmailOtpFieldRefs {
    readonly id: FieldRef<"EmailOtp", 'Int'>
    readonly email: FieldRef<"EmailOtp", 'String'>
    readonly otp: FieldRef<"EmailOtp", 'String'>
    readonly expiresAt: FieldRef<"EmailOtp", 'DateTime'>
    readonly wrongAttempts: FieldRef<"EmailOtp", 'Int'>
    readonly blockedUntil: FieldRef<"EmailOtp", 'DateTime'>
    readonly resendCount: FieldRef<"EmailOtp", 'Int'>
    readonly createdAt: FieldRef<"EmailOtp", 'DateTime'>
    readonly updatedAt: FieldRef<"EmailOtp", 'DateTime'>
    readonly enabled: FieldRef<"EmailOtp", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * EmailOtp findUnique
   */
  export type EmailOtpFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter, which EmailOtp to fetch.
     */
    where: EmailOtpWhereUniqueInput
  }

  /**
   * EmailOtp findUniqueOrThrow
   */
  export type EmailOtpFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter, which EmailOtp to fetch.
     */
    where: EmailOtpWhereUniqueInput
  }

  /**
   * EmailOtp findFirst
   */
  export type EmailOtpFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter, which EmailOtp to fetch.
     */
    where?: EmailOtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailOtps to fetch.
     */
    orderBy?: EmailOtpOrderByWithRelationInput | EmailOtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailOtps.
     */
    cursor?: EmailOtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailOtps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailOtps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailOtps.
     */
    distinct?: EmailOtpScalarFieldEnum | EmailOtpScalarFieldEnum[]
  }

  /**
   * EmailOtp findFirstOrThrow
   */
  export type EmailOtpFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter, which EmailOtp to fetch.
     */
    where?: EmailOtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailOtps to fetch.
     */
    orderBy?: EmailOtpOrderByWithRelationInput | EmailOtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailOtps.
     */
    cursor?: EmailOtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailOtps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailOtps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailOtps.
     */
    distinct?: EmailOtpScalarFieldEnum | EmailOtpScalarFieldEnum[]
  }

  /**
   * EmailOtp findMany
   */
  export type EmailOtpFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter, which EmailOtps to fetch.
     */
    where?: EmailOtpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailOtps to fetch.
     */
    orderBy?: EmailOtpOrderByWithRelationInput | EmailOtpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailOtps.
     */
    cursor?: EmailOtpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailOtps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailOtps.
     */
    skip?: number
    distinct?: EmailOtpScalarFieldEnum | EmailOtpScalarFieldEnum[]
  }

  /**
   * EmailOtp create
   */
  export type EmailOtpCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * The data needed to create a EmailOtp.
     */
    data: XOR<EmailOtpCreateInput, EmailOtpUncheckedCreateInput>
  }

  /**
   * EmailOtp createMany
   */
  export type EmailOtpCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailOtps.
     */
    data: EmailOtpCreateManyInput | EmailOtpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailOtp createManyAndReturn
   */
  export type EmailOtpCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * The data used to create many EmailOtps.
     */
    data: EmailOtpCreateManyInput | EmailOtpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailOtp update
   */
  export type EmailOtpUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * The data needed to update a EmailOtp.
     */
    data: XOR<EmailOtpUpdateInput, EmailOtpUncheckedUpdateInput>
    /**
     * Choose, which EmailOtp to update.
     */
    where: EmailOtpWhereUniqueInput
  }

  /**
   * EmailOtp updateMany
   */
  export type EmailOtpUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailOtps.
     */
    data: XOR<EmailOtpUpdateManyMutationInput, EmailOtpUncheckedUpdateManyInput>
    /**
     * Filter which EmailOtps to update
     */
    where?: EmailOtpWhereInput
    /**
     * Limit how many EmailOtps to update.
     */
    limit?: number
  }

  /**
   * EmailOtp updateManyAndReturn
   */
  export type EmailOtpUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * The data used to update EmailOtps.
     */
    data: XOR<EmailOtpUpdateManyMutationInput, EmailOtpUncheckedUpdateManyInput>
    /**
     * Filter which EmailOtps to update
     */
    where?: EmailOtpWhereInput
    /**
     * Limit how many EmailOtps to update.
     */
    limit?: number
  }

  /**
   * EmailOtp upsert
   */
  export type EmailOtpUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * The filter to search for the EmailOtp to update in case it exists.
     */
    where: EmailOtpWhereUniqueInput
    /**
     * In case the EmailOtp found by the `where` argument doesn't exist, create a new EmailOtp with this data.
     */
    create: XOR<EmailOtpCreateInput, EmailOtpUncheckedCreateInput>
    /**
     * In case the EmailOtp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailOtpUpdateInput, EmailOtpUncheckedUpdateInput>
  }

  /**
   * EmailOtp delete
   */
  export type EmailOtpDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
    /**
     * Filter which EmailOtp to delete.
     */
    where: EmailOtpWhereUniqueInput
  }

  /**
   * EmailOtp deleteMany
   */
  export type EmailOtpDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailOtps to delete
     */
    where?: EmailOtpWhereInput
    /**
     * Limit how many EmailOtps to delete.
     */
    limit?: number
  }

  /**
   * EmailOtp without action
   */
  export type EmailOtpDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailOtp
     */
    select?: EmailOtpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailOtp
     */
    omit?: EmailOtpOmit<ExtArgs> | null
  }


  /**
   * Model Vendor
   */

  export type AggregateVendor = {
    _count: VendorCountAggregateOutputType | null
    _avg: VendorAvgAggregateOutputType | null
    _sum: VendorSumAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  export type VendorAvgAggregateOutputType = {
    id: number | null
  }

  export type VendorSumAggregateOutputType = {
    id: number | null
  }

  export type VendorMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type VendorMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type VendorCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type VendorAvgAggregateInputType = {
    id?: true
  }

  export type VendorSumAggregateInputType = {
    id?: true
  }

  export type VendorMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type VendorMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type VendorCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type VendorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendor to aggregate.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vendors
    **/
    _count?: true | VendorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VendorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VendorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VendorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VendorMaxAggregateInputType
  }

  export type GetVendorAggregateType<T extends VendorAggregateArgs> = {
        [P in keyof T & keyof AggregateVendor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVendor[P]>
      : GetScalarType<T[P], AggregateVendor[P]>
  }




  export type VendorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VendorWhereInput
    orderBy?: VendorOrderByWithAggregationInput | VendorOrderByWithAggregationInput[]
    by: VendorScalarFieldEnum[] | VendorScalarFieldEnum
    having?: VendorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VendorCountAggregateInputType | true
    _avg?: VendorAvgAggregateInputType
    _sum?: VendorSumAggregateInputType
    _min?: VendorMinAggregateInputType
    _max?: VendorMaxAggregateInputType
  }

  export type VendorGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: VendorCountAggregateOutputType | null
    _avg: VendorAvgAggregateOutputType | null
    _sum: VendorSumAggregateOutputType | null
    _min: VendorMinAggregateOutputType | null
    _max: VendorMaxAggregateOutputType | null
  }

  type GetVendorGroupByPayload<T extends VendorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VendorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VendorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VendorGroupByOutputType[P]>
            : GetScalarType<T[P], VendorGroupByOutputType[P]>
        }
      >
    >


  export type VendorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    products?: boolean | Vendor$productsArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["vendor"]>

  export type VendorSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type VendorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["vendor"]>
  export type VendorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Vendor$productsArgs<ExtArgs>
    _count?: boolean | VendorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VendorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type VendorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $VendorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vendor"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["vendor"]>
    composites: {}
  }

  type VendorGetPayload<S extends boolean | null | undefined | VendorDefaultArgs> = $Result.GetResult<Prisma.$VendorPayload, S>

  type VendorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VendorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VendorCountAggregateInputType | true
    }

  export interface VendorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vendor'], meta: { name: 'Vendor' } }
    /**
     * Find zero or one Vendor that matches the filter.
     * @param {VendorFindUniqueArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VendorFindUniqueArgs>(args: SelectSubset<T, VendorFindUniqueArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vendor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VendorFindUniqueOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VendorFindUniqueOrThrowArgs>(args: SelectSubset<T, VendorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VendorFindFirstArgs>(args?: SelectSubset<T, VendorFindFirstArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vendor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindFirstOrThrowArgs} args - Arguments to find a Vendor
     * @example
     * // Get one Vendor
     * const vendor = await prisma.vendor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VendorFindFirstOrThrowArgs>(args?: SelectSubset<T, VendorFindFirstOrThrowArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vendors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vendors
     * const vendors = await prisma.vendor.findMany()
     * 
     * // Get first 10 Vendors
     * const vendors = await prisma.vendor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vendorWithIdOnly = await prisma.vendor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VendorFindManyArgs>(args?: SelectSubset<T, VendorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vendor.
     * @param {VendorCreateArgs} args - Arguments to create a Vendor.
     * @example
     * // Create one Vendor
     * const Vendor = await prisma.vendor.create({
     *   data: {
     *     // ... data to create a Vendor
     *   }
     * })
     * 
     */
    create<T extends VendorCreateArgs>(args: SelectSubset<T, VendorCreateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vendors.
     * @param {VendorCreateManyArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VendorCreateManyArgs>(args?: SelectSubset<T, VendorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vendors and returns the data saved in the database.
     * @param {VendorCreateManyAndReturnArgs} args - Arguments to create many Vendors.
     * @example
     * // Create many Vendors
     * const vendor = await prisma.vendor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VendorCreateManyAndReturnArgs>(args?: SelectSubset<T, VendorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vendor.
     * @param {VendorDeleteArgs} args - Arguments to delete one Vendor.
     * @example
     * // Delete one Vendor
     * const Vendor = await prisma.vendor.delete({
     *   where: {
     *     // ... filter to delete one Vendor
     *   }
     * })
     * 
     */
    delete<T extends VendorDeleteArgs>(args: SelectSubset<T, VendorDeleteArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vendor.
     * @param {VendorUpdateArgs} args - Arguments to update one Vendor.
     * @example
     * // Update one Vendor
     * const vendor = await prisma.vendor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VendorUpdateArgs>(args: SelectSubset<T, VendorUpdateArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vendors.
     * @param {VendorDeleteManyArgs} args - Arguments to filter Vendors to delete.
     * @example
     * // Delete a few Vendors
     * const { count } = await prisma.vendor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VendorDeleteManyArgs>(args?: SelectSubset<T, VendorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VendorUpdateManyArgs>(args: SelectSubset<T, VendorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vendors and returns the data updated in the database.
     * @param {VendorUpdateManyAndReturnArgs} args - Arguments to update many Vendors.
     * @example
     * // Update many Vendors
     * const vendor = await prisma.vendor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vendors and only return the `id`
     * const vendorWithIdOnly = await prisma.vendor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VendorUpdateManyAndReturnArgs>(args: SelectSubset<T, VendorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vendor.
     * @param {VendorUpsertArgs} args - Arguments to update or create a Vendor.
     * @example
     * // Update or create a Vendor
     * const vendor = await prisma.vendor.upsert({
     *   create: {
     *     // ... data to create a Vendor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vendor we want to update
     *   }
     * })
     */
    upsert<T extends VendorUpsertArgs>(args: SelectSubset<T, VendorUpsertArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vendors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorCountArgs} args - Arguments to filter Vendors to count.
     * @example
     * // Count the number of Vendors
     * const count = await prisma.vendor.count({
     *   where: {
     *     // ... the filter for the Vendors we want to count
     *   }
     * })
    **/
    count<T extends VendorCountArgs>(
      args?: Subset<T, VendorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VendorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VendorAggregateArgs>(args: Subset<T, VendorAggregateArgs>): Prisma.PrismaPromise<GetVendorAggregateType<T>>

    /**
     * Group by Vendor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VendorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VendorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VendorGroupByArgs['orderBy'] }
        : { orderBy?: VendorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VendorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVendorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vendor model
   */
  readonly fields: VendorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vendor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VendorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Vendor$productsArgs<ExtArgs> = {}>(args?: Subset<T, Vendor$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vendor model
   */
  interface VendorFieldRefs {
    readonly id: FieldRef<"Vendor", 'Int'>
    readonly name: FieldRef<"Vendor", 'String'>
    readonly slug: FieldRef<"Vendor", 'String'>
    readonly description: FieldRef<"Vendor", 'String'>
    readonly createdAt: FieldRef<"Vendor", 'DateTime'>
    readonly updatedAt: FieldRef<"Vendor", 'DateTime'>
    readonly enabled: FieldRef<"Vendor", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Vendor findUnique
   */
  export type VendorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findUniqueOrThrow
   */
  export type VendorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor findFirst
   */
  export type VendorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findFirstOrThrow
   */
  export type VendorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendor to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vendors.
     */
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor findMany
   */
  export type VendorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter, which Vendors to fetch.
     */
    where?: VendorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vendors to fetch.
     */
    orderBy?: VendorOrderByWithRelationInput | VendorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vendors.
     */
    cursor?: VendorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vendors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vendors.
     */
    skip?: number
    distinct?: VendorScalarFieldEnum | VendorScalarFieldEnum[]
  }

  /**
   * Vendor create
   */
  export type VendorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to create a Vendor.
     */
    data: XOR<VendorCreateInput, VendorUncheckedCreateInput>
  }

  /**
   * Vendor createMany
   */
  export type VendorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor createManyAndReturn
   */
  export type VendorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * The data used to create many Vendors.
     */
    data: VendorCreateManyInput | VendorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vendor update
   */
  export type VendorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The data needed to update a Vendor.
     */
    data: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
    /**
     * Choose, which Vendor to update.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor updateMany
   */
  export type VendorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor updateManyAndReturn
   */
  export type VendorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * The data used to update Vendors.
     */
    data: XOR<VendorUpdateManyMutationInput, VendorUncheckedUpdateManyInput>
    /**
     * Filter which Vendors to update
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to update.
     */
    limit?: number
  }

  /**
   * Vendor upsert
   */
  export type VendorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * The filter to search for the Vendor to update in case it exists.
     */
    where: VendorWhereUniqueInput
    /**
     * In case the Vendor found by the `where` argument doesn't exist, create a new Vendor with this data.
     */
    create: XOR<VendorCreateInput, VendorUncheckedCreateInput>
    /**
     * In case the Vendor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VendorUpdateInput, VendorUncheckedUpdateInput>
  }

  /**
   * Vendor delete
   */
  export type VendorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    /**
     * Filter which Vendor to delete.
     */
    where: VendorWhereUniqueInput
  }

  /**
   * Vendor deleteMany
   */
  export type VendorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vendors to delete
     */
    where?: VendorWhereInput
    /**
     * Limit how many Vendors to delete.
     */
    limit?: number
  }

  /**
   * Vendor.products
   */
  export type Vendor$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Vendor without action
   */
  export type VendorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
  }


  /**
   * Model ProductType
   */

  export type AggregateProductType = {
    _count: ProductTypeCountAggregateOutputType | null
    _avg: ProductTypeAvgAggregateOutputType | null
    _sum: ProductTypeSumAggregateOutputType | null
    _min: ProductTypeMinAggregateOutputType | null
    _max: ProductTypeMaxAggregateOutputType | null
  }

  export type ProductTypeAvgAggregateOutputType = {
    id: number | null
  }

  export type ProductTypeSumAggregateOutputType = {
    id: number | null
  }

  export type ProductTypeMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductTypeMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductTypeCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type ProductTypeAvgAggregateInputType = {
    id?: true
  }

  export type ProductTypeSumAggregateInputType = {
    id?: true
  }

  export type ProductTypeMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductTypeMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductTypeCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type ProductTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductType to aggregate.
     */
    where?: ProductTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductTypes to fetch.
     */
    orderBy?: ProductTypeOrderByWithRelationInput | ProductTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductTypes
    **/
    _count?: true | ProductTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductTypeMaxAggregateInputType
  }

  export type GetProductTypeAggregateType<T extends ProductTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateProductType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductType[P]>
      : GetScalarType<T[P], AggregateProductType[P]>
  }




  export type ProductTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductTypeWhereInput
    orderBy?: ProductTypeOrderByWithAggregationInput | ProductTypeOrderByWithAggregationInput[]
    by: ProductTypeScalarFieldEnum[] | ProductTypeScalarFieldEnum
    having?: ProductTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductTypeCountAggregateInputType | true
    _avg?: ProductTypeAvgAggregateInputType
    _sum?: ProductTypeSumAggregateInputType
    _min?: ProductTypeMinAggregateInputType
    _max?: ProductTypeMaxAggregateInputType
  }

  export type ProductTypeGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: ProductTypeCountAggregateOutputType | null
    _avg: ProductTypeAvgAggregateOutputType | null
    _sum: ProductTypeSumAggregateOutputType | null
    _min: ProductTypeMinAggregateOutputType | null
    _max: ProductTypeMaxAggregateOutputType | null
  }

  type GetProductTypeGroupByPayload<T extends ProductTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductTypeGroupByOutputType[P]>
            : GetScalarType<T[P], ProductTypeGroupByOutputType[P]>
        }
      >
    >


  export type ProductTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    products?: boolean | ProductType$productsArgs<ExtArgs>
    _count?: boolean | ProductTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productType"]>

  export type ProductTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["productType"]>

  export type ProductTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["productType"]>

  export type ProductTypeSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type ProductTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["productType"]>
  export type ProductTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | ProductType$productsArgs<ExtArgs>
    _count?: boolean | ProductTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProductTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProductTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductType"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["productType"]>
    composites: {}
  }

  type ProductTypeGetPayload<S extends boolean | null | undefined | ProductTypeDefaultArgs> = $Result.GetResult<Prisma.$ProductTypePayload, S>

  type ProductTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductTypeCountAggregateInputType | true
    }

  export interface ProductTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductType'], meta: { name: 'ProductType' } }
    /**
     * Find zero or one ProductType that matches the filter.
     * @param {ProductTypeFindUniqueArgs} args - Arguments to find a ProductType
     * @example
     * // Get one ProductType
     * const productType = await prisma.productType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductTypeFindUniqueArgs>(args: SelectSubset<T, ProductTypeFindUniqueArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductTypeFindUniqueOrThrowArgs} args - Arguments to find a ProductType
     * @example
     * // Get one ProductType
     * const productType = await prisma.productType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeFindFirstArgs} args - Arguments to find a ProductType
     * @example
     * // Get one ProductType
     * const productType = await prisma.productType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductTypeFindFirstArgs>(args?: SelectSubset<T, ProductTypeFindFirstArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeFindFirstOrThrowArgs} args - Arguments to find a ProductType
     * @example
     * // Get one ProductType
     * const productType = await prisma.productType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductTypes
     * const productTypes = await prisma.productType.findMany()
     * 
     * // Get first 10 ProductTypes
     * const productTypes = await prisma.productType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productTypeWithIdOnly = await prisma.productType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductTypeFindManyArgs>(args?: SelectSubset<T, ProductTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductType.
     * @param {ProductTypeCreateArgs} args - Arguments to create a ProductType.
     * @example
     * // Create one ProductType
     * const ProductType = await prisma.productType.create({
     *   data: {
     *     // ... data to create a ProductType
     *   }
     * })
     * 
     */
    create<T extends ProductTypeCreateArgs>(args: SelectSubset<T, ProductTypeCreateArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductTypes.
     * @param {ProductTypeCreateManyArgs} args - Arguments to create many ProductTypes.
     * @example
     * // Create many ProductTypes
     * const productType = await prisma.productType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductTypeCreateManyArgs>(args?: SelectSubset<T, ProductTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductTypes and returns the data saved in the database.
     * @param {ProductTypeCreateManyAndReturnArgs} args - Arguments to create many ProductTypes.
     * @example
     * // Create many ProductTypes
     * const productType = await prisma.productType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductTypes and only return the `id`
     * const productTypeWithIdOnly = await prisma.productType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductType.
     * @param {ProductTypeDeleteArgs} args - Arguments to delete one ProductType.
     * @example
     * // Delete one ProductType
     * const ProductType = await prisma.productType.delete({
     *   where: {
     *     // ... filter to delete one ProductType
     *   }
     * })
     * 
     */
    delete<T extends ProductTypeDeleteArgs>(args: SelectSubset<T, ProductTypeDeleteArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductType.
     * @param {ProductTypeUpdateArgs} args - Arguments to update one ProductType.
     * @example
     * // Update one ProductType
     * const productType = await prisma.productType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductTypeUpdateArgs>(args: SelectSubset<T, ProductTypeUpdateArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductTypes.
     * @param {ProductTypeDeleteManyArgs} args - Arguments to filter ProductTypes to delete.
     * @example
     * // Delete a few ProductTypes
     * const { count } = await prisma.productType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductTypeDeleteManyArgs>(args?: SelectSubset<T, ProductTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductTypes
     * const productType = await prisma.productType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductTypeUpdateManyArgs>(args: SelectSubset<T, ProductTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductTypes and returns the data updated in the database.
     * @param {ProductTypeUpdateManyAndReturnArgs} args - Arguments to update many ProductTypes.
     * @example
     * // Update many ProductTypes
     * const productType = await prisma.productType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductTypes and only return the `id`
     * const productTypeWithIdOnly = await prisma.productType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductType.
     * @param {ProductTypeUpsertArgs} args - Arguments to update or create a ProductType.
     * @example
     * // Update or create a ProductType
     * const productType = await prisma.productType.upsert({
     *   create: {
     *     // ... data to create a ProductType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductType we want to update
     *   }
     * })
     */
    upsert<T extends ProductTypeUpsertArgs>(args: SelectSubset<T, ProductTypeUpsertArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeCountArgs} args - Arguments to filter ProductTypes to count.
     * @example
     * // Count the number of ProductTypes
     * const count = await prisma.productType.count({
     *   where: {
     *     // ... the filter for the ProductTypes we want to count
     *   }
     * })
    **/
    count<T extends ProductTypeCountArgs>(
      args?: Subset<T, ProductTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductTypeAggregateArgs>(args: Subset<T, ProductTypeAggregateArgs>): Prisma.PrismaPromise<GetProductTypeAggregateType<T>>

    /**
     * Group by ProductType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductTypeGroupByArgs['orderBy'] }
        : { orderBy?: ProductTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductType model
   */
  readonly fields: ProductTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends ProductType$productsArgs<ExtArgs> = {}>(args?: Subset<T, ProductType$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductType model
   */
  interface ProductTypeFieldRefs {
    readonly id: FieldRef<"ProductType", 'Int'>
    readonly name: FieldRef<"ProductType", 'String'>
    readonly slug: FieldRef<"ProductType", 'String'>
    readonly description: FieldRef<"ProductType", 'String'>
    readonly createdAt: FieldRef<"ProductType", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductType", 'DateTime'>
    readonly enabled: FieldRef<"ProductType", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ProductType findUnique
   */
  export type ProductTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProductType to fetch.
     */
    where: ProductTypeWhereUniqueInput
  }

  /**
   * ProductType findUniqueOrThrow
   */
  export type ProductTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProductType to fetch.
     */
    where: ProductTypeWhereUniqueInput
  }

  /**
   * ProductType findFirst
   */
  export type ProductTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProductType to fetch.
     */
    where?: ProductTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductTypes to fetch.
     */
    orderBy?: ProductTypeOrderByWithRelationInput | ProductTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductTypes.
     */
    cursor?: ProductTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductTypes.
     */
    distinct?: ProductTypeScalarFieldEnum | ProductTypeScalarFieldEnum[]
  }

  /**
   * ProductType findFirstOrThrow
   */
  export type ProductTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProductType to fetch.
     */
    where?: ProductTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductTypes to fetch.
     */
    orderBy?: ProductTypeOrderByWithRelationInput | ProductTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductTypes.
     */
    cursor?: ProductTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductTypes.
     */
    distinct?: ProductTypeScalarFieldEnum | ProductTypeScalarFieldEnum[]
  }

  /**
   * ProductType findMany
   */
  export type ProductTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter, which ProductTypes to fetch.
     */
    where?: ProductTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductTypes to fetch.
     */
    orderBy?: ProductTypeOrderByWithRelationInput | ProductTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductTypes.
     */
    cursor?: ProductTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductTypes.
     */
    skip?: number
    distinct?: ProductTypeScalarFieldEnum | ProductTypeScalarFieldEnum[]
  }

  /**
   * ProductType create
   */
  export type ProductTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductType.
     */
    data: XOR<ProductTypeCreateInput, ProductTypeUncheckedCreateInput>
  }

  /**
   * ProductType createMany
   */
  export type ProductTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductTypes.
     */
    data: ProductTypeCreateManyInput | ProductTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductType createManyAndReturn
   */
  export type ProductTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * The data used to create many ProductTypes.
     */
    data: ProductTypeCreateManyInput | ProductTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductType update
   */
  export type ProductTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductType.
     */
    data: XOR<ProductTypeUpdateInput, ProductTypeUncheckedUpdateInput>
    /**
     * Choose, which ProductType to update.
     */
    where: ProductTypeWhereUniqueInput
  }

  /**
   * ProductType updateMany
   */
  export type ProductTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductTypes.
     */
    data: XOR<ProductTypeUpdateManyMutationInput, ProductTypeUncheckedUpdateManyInput>
    /**
     * Filter which ProductTypes to update
     */
    where?: ProductTypeWhereInput
    /**
     * Limit how many ProductTypes to update.
     */
    limit?: number
  }

  /**
   * ProductType updateManyAndReturn
   */
  export type ProductTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * The data used to update ProductTypes.
     */
    data: XOR<ProductTypeUpdateManyMutationInput, ProductTypeUncheckedUpdateManyInput>
    /**
     * Filter which ProductTypes to update
     */
    where?: ProductTypeWhereInput
    /**
     * Limit how many ProductTypes to update.
     */
    limit?: number
  }

  /**
   * ProductType upsert
   */
  export type ProductTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductType to update in case it exists.
     */
    where: ProductTypeWhereUniqueInput
    /**
     * In case the ProductType found by the `where` argument doesn't exist, create a new ProductType with this data.
     */
    create: XOR<ProductTypeCreateInput, ProductTypeUncheckedCreateInput>
    /**
     * In case the ProductType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductTypeUpdateInput, ProductTypeUncheckedUpdateInput>
  }

  /**
   * ProductType delete
   */
  export type ProductTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    /**
     * Filter which ProductType to delete.
     */
    where: ProductTypeWhereUniqueInput
  }

  /**
   * ProductType deleteMany
   */
  export type ProductTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductTypes to delete
     */
    where?: ProductTypeWhereInput
    /**
     * Limit how many ProductTypes to delete.
     */
    limit?: number
  }

  /**
   * ProductType.products
   */
  export type ProductType$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * ProductType without action
   */
  export type ProductTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Category$productsArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Category$productsArgs<ExtArgs> = {}>(args?: Subset<T, Category$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly description: FieldRef<"Category", 'String'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
    readonly updatedAt: FieldRef<"Category", 'DateTime'>
    readonly enabled: FieldRef<"Category", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.products
   */
  export type Category$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Product
   */

  export type AggregateProduct = {
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  export type ProductAvgAggregateOutputType = {
    id: number | null
    vendorId: number | null
    productTypeId: number | null
    price: Decimal | null
    discountedPrice: Decimal | null
    inventoryQuantity: number | null
    referralPercentage: number | null
    categoryId: number | null
    tagId: number | null
  }

  export type ProductSumAggregateOutputType = {
    id: number | null
    vendorId: number | null
    productTypeId: number | null
    price: Decimal | null
    discountedPrice: Decimal | null
    inventoryQuantity: number | null
    referralPercentage: number | null
    categoryId: number | null
    tagId: number | null
  }

  export type ProductMinAggregateOutputType = {
    id: number | null
    title: string | null
    slug: string | null
    description: string | null
    vendorId: number | null
    productTypeId: number | null
    published: boolean | null
    publishedAt: Date | null
    price: Decimal | null
    discountedPrice: Decimal | null
    sku: string | null
    inventoryQuantity: number | null
    available: boolean | null
    referralPercentage: number | null
    shopifyProductId: string | null
    categoryId: number | null
    tagId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductMaxAggregateOutputType = {
    id: number | null
    title: string | null
    slug: string | null
    description: string | null
    vendorId: number | null
    productTypeId: number | null
    published: boolean | null
    publishedAt: Date | null
    price: Decimal | null
    discountedPrice: Decimal | null
    sku: string | null
    inventoryQuantity: number | null
    available: boolean | null
    referralPercentage: number | null
    shopifyProductId: string | null
    categoryId: number | null
    tagId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    description: number
    vendorId: number
    productTypeId: number
    published: number
    publishedAt: number
    price: number
    discountedPrice: number
    sku: number
    inventoryQuantity: number
    available: number
    referralPercentage: number
    shopifyProductId: number
    images: number
    categoryId: number
    tagId: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type ProductAvgAggregateInputType = {
    id?: true
    vendorId?: true
    productTypeId?: true
    price?: true
    discountedPrice?: true
    inventoryQuantity?: true
    referralPercentage?: true
    categoryId?: true
    tagId?: true
  }

  export type ProductSumAggregateInputType = {
    id?: true
    vendorId?: true
    productTypeId?: true
    price?: true
    discountedPrice?: true
    inventoryQuantity?: true
    referralPercentage?: true
    categoryId?: true
    tagId?: true
  }

  export type ProductMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    vendorId?: true
    productTypeId?: true
    published?: true
    publishedAt?: true
    price?: true
    discountedPrice?: true
    sku?: true
    inventoryQuantity?: true
    available?: true
    referralPercentage?: true
    shopifyProductId?: true
    categoryId?: true
    tagId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    vendorId?: true
    productTypeId?: true
    published?: true
    publishedAt?: true
    price?: true
    discountedPrice?: true
    sku?: true
    inventoryQuantity?: true
    available?: true
    referralPercentage?: true
    shopifyProductId?: true
    categoryId?: true
    tagId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    vendorId?: true
    productTypeId?: true
    published?: true
    publishedAt?: true
    price?: true
    discountedPrice?: true
    sku?: true
    inventoryQuantity?: true
    available?: true
    referralPercentage?: true
    shopifyProductId?: true
    images?: true
    categoryId?: true
    tagId?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type ProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Product to aggregate.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Products
    **/
    _count?: true | ProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductMaxAggregateInputType
  }

  export type GetProductAggregateType<T extends ProductAggregateArgs> = {
        [P in keyof T & keyof AggregateProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduct[P]>
      : GetScalarType<T[P], AggregateProduct[P]>
  }




  export type ProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithAggregationInput | ProductOrderByWithAggregationInput[]
    by: ProductScalarFieldEnum[] | ProductScalarFieldEnum
    having?: ProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductCountAggregateInputType | true
    _avg?: ProductAvgAggregateInputType
    _sum?: ProductSumAggregateInputType
    _min?: ProductMinAggregateInputType
    _max?: ProductMaxAggregateInputType
  }

  export type ProductGroupByOutputType = {
    id: number
    title: string
    slug: string
    description: string | null
    vendorId: number | null
    productTypeId: number | null
    published: boolean
    publishedAt: Date | null
    price: Decimal | null
    discountedPrice: Decimal | null
    sku: string | null
    inventoryQuantity: number | null
    available: boolean
    referralPercentage: number
    shopifyProductId: string | null
    images: string[]
    categoryId: number | null
    tagId: number | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: ProductCountAggregateOutputType | null
    _avg: ProductAvgAggregateOutputType | null
    _sum: ProductSumAggregateOutputType | null
    _min: ProductMinAggregateOutputType | null
    _max: ProductMaxAggregateOutputType | null
  }

  type GetProductGroupByPayload<T extends ProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductGroupByOutputType[P]>
            : GetScalarType<T[P], ProductGroupByOutputType[P]>
        }
      >
    >


  export type ProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    vendorId?: boolean
    productTypeId?: boolean
    published?: boolean
    publishedAt?: boolean
    price?: boolean
    discountedPrice?: boolean
    sku?: boolean
    inventoryQuantity?: boolean
    available?: boolean
    referralPercentage?: boolean
    shopifyProductId?: boolean
    images?: boolean
    categoryId?: boolean
    tagId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    variants?: boolean | Product$variantsArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    vendorId?: boolean
    productTypeId?: boolean
    published?: boolean
    publishedAt?: boolean
    price?: boolean
    discountedPrice?: boolean
    sku?: boolean
    inventoryQuantity?: boolean
    available?: boolean
    referralPercentage?: boolean
    shopifyProductId?: boolean
    images?: boolean
    categoryId?: boolean
    tagId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    vendorId?: boolean
    productTypeId?: boolean
    published?: boolean
    publishedAt?: boolean
    price?: boolean
    discountedPrice?: boolean
    sku?: boolean
    inventoryQuantity?: boolean
    available?: boolean
    referralPercentage?: boolean
    shopifyProductId?: boolean
    images?: boolean
    categoryId?: boolean
    tagId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
  }, ExtArgs["result"]["product"]>

  export type ProductSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    vendorId?: boolean
    productTypeId?: boolean
    published?: boolean
    publishedAt?: boolean
    price?: boolean
    discountedPrice?: boolean
    sku?: boolean
    inventoryQuantity?: boolean
    available?: boolean
    referralPercentage?: boolean
    shopifyProductId?: boolean
    images?: boolean
    categoryId?: boolean
    tagId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type ProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "description" | "vendorId" | "productTypeId" | "published" | "publishedAt" | "price" | "discountedPrice" | "sku" | "inventoryQuantity" | "available" | "referralPercentage" | "shopifyProductId" | "images" | "categoryId" | "tagId" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["product"]>
  export type ProductInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    variants?: boolean | Product$variantsArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
    _count?: boolean | ProductCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
  }
  export type ProductIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vendor?: boolean | Product$vendorArgs<ExtArgs>
    productType?: boolean | Product$productTypeArgs<ExtArgs>
    category?: boolean | Product$categoryArgs<ExtArgs>
    tag?: boolean | Product$tagArgs<ExtArgs>
  }

  export type $ProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Product"
    objects: {
      vendor: Prisma.$VendorPayload<ExtArgs> | null
      productType: Prisma.$ProductTypePayload<ExtArgs> | null
      variants: Prisma.$ProductVariantPayload<ExtArgs>[]
      category: Prisma.$CategoryPayload<ExtArgs> | null
      tag: Prisma.$TagPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      slug: string
      description: string | null
      vendorId: number | null
      productTypeId: number | null
      published: boolean
      publishedAt: Date | null
      price: Prisma.Decimal | null
      discountedPrice: Prisma.Decimal | null
      sku: string | null
      inventoryQuantity: number | null
      available: boolean
      referralPercentage: number
      shopifyProductId: string | null
      images: string[]
      categoryId: number | null
      tagId: number | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["product"]>
    composites: {}
  }

  type ProductGetPayload<S extends boolean | null | undefined | ProductDefaultArgs> = $Result.GetResult<Prisma.$ProductPayload, S>

  type ProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductCountAggregateInputType | true
    }

  export interface ProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Product'], meta: { name: 'Product' } }
    /**
     * Find zero or one Product that matches the filter.
     * @param {ProductFindUniqueArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductFindUniqueArgs>(args: SelectSubset<T, ProductFindUniqueArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Product that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductFindUniqueOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductFindFirstArgs>(args?: SelectSubset<T, ProductFindFirstArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Product that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindFirstOrThrowArgs} args - Arguments to find a Product
     * @example
     * // Get one Product
     * const product = await prisma.product.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Products that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Products
     * const products = await prisma.product.findMany()
     * 
     * // Get first 10 Products
     * const products = await prisma.product.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productWithIdOnly = await prisma.product.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductFindManyArgs>(args?: SelectSubset<T, ProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Product.
     * @param {ProductCreateArgs} args - Arguments to create a Product.
     * @example
     * // Create one Product
     * const Product = await prisma.product.create({
     *   data: {
     *     // ... data to create a Product
     *   }
     * })
     * 
     */
    create<T extends ProductCreateArgs>(args: SelectSubset<T, ProductCreateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Products.
     * @param {ProductCreateManyArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductCreateManyArgs>(args?: SelectSubset<T, ProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Products and returns the data saved in the database.
     * @param {ProductCreateManyAndReturnArgs} args - Arguments to create many Products.
     * @example
     * // Create many Products
     * const product = await prisma.product.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Products and only return the `id`
     * const productWithIdOnly = await prisma.product.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Product.
     * @param {ProductDeleteArgs} args - Arguments to delete one Product.
     * @example
     * // Delete one Product
     * const Product = await prisma.product.delete({
     *   where: {
     *     // ... filter to delete one Product
     *   }
     * })
     * 
     */
    delete<T extends ProductDeleteArgs>(args: SelectSubset<T, ProductDeleteArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Product.
     * @param {ProductUpdateArgs} args - Arguments to update one Product.
     * @example
     * // Update one Product
     * const product = await prisma.product.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductUpdateArgs>(args: SelectSubset<T, ProductUpdateArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Products.
     * @param {ProductDeleteManyArgs} args - Arguments to filter Products to delete.
     * @example
     * // Delete a few Products
     * const { count } = await prisma.product.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductDeleteManyArgs>(args?: SelectSubset<T, ProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductUpdateManyArgs>(args: SelectSubset<T, ProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Products and returns the data updated in the database.
     * @param {ProductUpdateManyAndReturnArgs} args - Arguments to update many Products.
     * @example
     * // Update many Products
     * const product = await prisma.product.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Products and only return the `id`
     * const productWithIdOnly = await prisma.product.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Product.
     * @param {ProductUpsertArgs} args - Arguments to update or create a Product.
     * @example
     * // Update or create a Product
     * const product = await prisma.product.upsert({
     *   create: {
     *     // ... data to create a Product
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Product we want to update
     *   }
     * })
     */
    upsert<T extends ProductUpsertArgs>(args: SelectSubset<T, ProductUpsertArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Products.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductCountArgs} args - Arguments to filter Products to count.
     * @example
     * // Count the number of Products
     * const count = await prisma.product.count({
     *   where: {
     *     // ... the filter for the Products we want to count
     *   }
     * })
    **/
    count<T extends ProductCountArgs>(
      args?: Subset<T, ProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductAggregateArgs>(args: Subset<T, ProductAggregateArgs>): Prisma.PrismaPromise<GetProductAggregateType<T>>

    /**
     * Group by Product.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductGroupByArgs['orderBy'] }
        : { orderBy?: ProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Product model
   */
  readonly fields: ProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Product.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vendor<T extends Product$vendorArgs<ExtArgs> = {}>(args?: Subset<T, Product$vendorArgs<ExtArgs>>): Prisma__VendorClient<$Result.GetResult<Prisma.$VendorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    productType<T extends Product$productTypeArgs<ExtArgs> = {}>(args?: Subset<T, Product$productTypeArgs<ExtArgs>>): Prisma__ProductTypeClient<$Result.GetResult<Prisma.$ProductTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    variants<T extends Product$variantsArgs<ExtArgs> = {}>(args?: Subset<T, Product$variantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    category<T extends Product$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Product$categoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tag<T extends Product$tagArgs<ExtArgs> = {}>(args?: Subset<T, Product$tagArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Product model
   */
  interface ProductFieldRefs {
    readonly id: FieldRef<"Product", 'Int'>
    readonly title: FieldRef<"Product", 'String'>
    readonly slug: FieldRef<"Product", 'String'>
    readonly description: FieldRef<"Product", 'String'>
    readonly vendorId: FieldRef<"Product", 'Int'>
    readonly productTypeId: FieldRef<"Product", 'Int'>
    readonly published: FieldRef<"Product", 'Boolean'>
    readonly publishedAt: FieldRef<"Product", 'DateTime'>
    readonly price: FieldRef<"Product", 'Decimal'>
    readonly discountedPrice: FieldRef<"Product", 'Decimal'>
    readonly sku: FieldRef<"Product", 'String'>
    readonly inventoryQuantity: FieldRef<"Product", 'Int'>
    readonly available: FieldRef<"Product", 'Boolean'>
    readonly referralPercentage: FieldRef<"Product", 'Float'>
    readonly shopifyProductId: FieldRef<"Product", 'String'>
    readonly images: FieldRef<"Product", 'String[]'>
    readonly categoryId: FieldRef<"Product", 'Int'>
    readonly tagId: FieldRef<"Product", 'Int'>
    readonly createdAt: FieldRef<"Product", 'DateTime'>
    readonly updatedAt: FieldRef<"Product", 'DateTime'>
    readonly enabled: FieldRef<"Product", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Product findUnique
   */
  export type ProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findUniqueOrThrow
   */
  export type ProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product findFirst
   */
  export type ProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findFirstOrThrow
   */
  export type ProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Product to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Products.
     */
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product findMany
   */
  export type ProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter, which Products to fetch.
     */
    where?: ProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Products to fetch.
     */
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Products.
     */
    cursor?: ProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Products from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Products.
     */
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Product create
   */
  export type ProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to create a Product.
     */
    data: XOR<ProductCreateInput, ProductUncheckedCreateInput>
  }

  /**
   * Product createMany
   */
  export type ProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Product createManyAndReturn
   */
  export type ProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to create many Products.
     */
    data: ProductCreateManyInput | ProductCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product update
   */
  export type ProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The data needed to update a Product.
     */
    data: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
    /**
     * Choose, which Product to update.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product updateMany
   */
  export type ProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
  }

  /**
   * Product updateManyAndReturn
   */
  export type ProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * The data used to update Products.
     */
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyInput>
    /**
     * Filter which Products to update
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Product upsert
   */
  export type ProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * The filter to search for the Product to update in case it exists.
     */
    where: ProductWhereUniqueInput
    /**
     * In case the Product found by the `where` argument doesn't exist, create a new Product with this data.
     */
    create: XOR<ProductCreateInput, ProductUncheckedCreateInput>
    /**
     * In case the Product was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductUpdateInput, ProductUncheckedUpdateInput>
  }

  /**
   * Product delete
   */
  export type ProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    /**
     * Filter which Product to delete.
     */
    where: ProductWhereUniqueInput
  }

  /**
   * Product deleteMany
   */
  export type ProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Products to delete
     */
    where?: ProductWhereInput
    /**
     * Limit how many Products to delete.
     */
    limit?: number
  }

  /**
   * Product.vendor
   */
  export type Product$vendorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vendor
     */
    select?: VendorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vendor
     */
    omit?: VendorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VendorInclude<ExtArgs> | null
    where?: VendorWhereInput
  }

  /**
   * Product.productType
   */
  export type Product$productTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductType
     */
    select?: ProductTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductType
     */
    omit?: ProductTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductTypeInclude<ExtArgs> | null
    where?: ProductTypeWhereInput
  }

  /**
   * Product.variants
   */
  export type Product$variantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    where?: ProductVariantWhereInput
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    cursor?: ProductVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * Product.category
   */
  export type Product$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Product.tag
   */
  export type Product$tagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
  }

  /**
   * Product without action
   */
  export type ProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
  }


  /**
   * Model ProductVariant
   */

  export type AggregateProductVariant = {
    _count: ProductVariantCountAggregateOutputType | null
    _avg: ProductVariantAvgAggregateOutputType | null
    _sum: ProductVariantSumAggregateOutputType | null
    _min: ProductVariantMinAggregateOutputType | null
    _max: ProductVariantMaxAggregateOutputType | null
  }

  export type ProductVariantAvgAggregateOutputType = {
    id: number | null
    productId: number | null
    parentVariantId: number | null
    price: Decimal | null
    discountedPrice: Decimal | null
    referralPercentage: number | null
    inventoryQuantity: number | null
    weight: number | null
    position: number | null
  }

  export type ProductVariantSumAggregateOutputType = {
    id: number | null
    productId: number | null
    parentVariantId: number | null
    price: Decimal | null
    discountedPrice: Decimal | null
    referralPercentage: number | null
    inventoryQuantity: number | null
    weight: number | null
    position: number | null
  }

  export type ProductVariantMinAggregateOutputType = {
    id: number | null
    productId: number | null
    parentVariantId: number | null
    shopifyProductId: string | null
    title: string | null
    sku: string | null
    price: Decimal | null
    discountedPrice: Decimal | null
    referralPercentage: number | null
    available: boolean | null
    inventoryQuantity: number | null
    weight: number | null
    requiresShipping: boolean | null
    taxable: boolean | null
    shopifyVariantId: string | null
    position: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductVariantMaxAggregateOutputType = {
    id: number | null
    productId: number | null
    parentVariantId: number | null
    shopifyProductId: string | null
    title: string | null
    sku: string | null
    price: Decimal | null
    discountedPrice: Decimal | null
    referralPercentage: number | null
    available: boolean | null
    inventoryQuantity: number | null
    weight: number | null
    requiresShipping: boolean | null
    taxable: boolean | null
    shopifyVariantId: string | null
    position: number | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type ProductVariantCountAggregateOutputType = {
    id: number
    productId: number
    parentVariantId: number
    shopifyProductId: number
    title: number
    sku: number
    price: number
    discountedPrice: number
    referralPercentage: number
    available: number
    inventoryQuantity: number
    images: number
    weight: number
    requiresShipping: number
    taxable: number
    shopifyVariantId: number
    position: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type ProductVariantAvgAggregateInputType = {
    id?: true
    productId?: true
    parentVariantId?: true
    price?: true
    discountedPrice?: true
    referralPercentage?: true
    inventoryQuantity?: true
    weight?: true
    position?: true
  }

  export type ProductVariantSumAggregateInputType = {
    id?: true
    productId?: true
    parentVariantId?: true
    price?: true
    discountedPrice?: true
    referralPercentage?: true
    inventoryQuantity?: true
    weight?: true
    position?: true
  }

  export type ProductVariantMinAggregateInputType = {
    id?: true
    productId?: true
    parentVariantId?: true
    shopifyProductId?: true
    title?: true
    sku?: true
    price?: true
    discountedPrice?: true
    referralPercentage?: true
    available?: true
    inventoryQuantity?: true
    weight?: true
    requiresShipping?: true
    taxable?: true
    shopifyVariantId?: true
    position?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductVariantMaxAggregateInputType = {
    id?: true
    productId?: true
    parentVariantId?: true
    shopifyProductId?: true
    title?: true
    sku?: true
    price?: true
    discountedPrice?: true
    referralPercentage?: true
    available?: true
    inventoryQuantity?: true
    weight?: true
    requiresShipping?: true
    taxable?: true
    shopifyVariantId?: true
    position?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type ProductVariantCountAggregateInputType = {
    id?: true
    productId?: true
    parentVariantId?: true
    shopifyProductId?: true
    title?: true
    sku?: true
    price?: true
    discountedPrice?: true
    referralPercentage?: true
    available?: true
    inventoryQuantity?: true
    images?: true
    weight?: true
    requiresShipping?: true
    taxable?: true
    shopifyVariantId?: true
    position?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type ProductVariantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductVariant to aggregate.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductVariants
    **/
    _count?: true | ProductVariantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProductVariantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProductVariantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductVariantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductVariantMaxAggregateInputType
  }

  export type GetProductVariantAggregateType<T extends ProductVariantAggregateArgs> = {
        [P in keyof T & keyof AggregateProductVariant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductVariant[P]>
      : GetScalarType<T[P], AggregateProductVariant[P]>
  }




  export type ProductVariantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductVariantWhereInput
    orderBy?: ProductVariantOrderByWithAggregationInput | ProductVariantOrderByWithAggregationInput[]
    by: ProductVariantScalarFieldEnum[] | ProductVariantScalarFieldEnum
    having?: ProductVariantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductVariantCountAggregateInputType | true
    _avg?: ProductVariantAvgAggregateInputType
    _sum?: ProductVariantSumAggregateInputType
    _min?: ProductVariantMinAggregateInputType
    _max?: ProductVariantMaxAggregateInputType
  }

  export type ProductVariantGroupByOutputType = {
    id: number
    productId: number
    parentVariantId: number | null
    shopifyProductId: string | null
    title: string
    sku: string | null
    price: Decimal | null
    discountedPrice: Decimal | null
    referralPercentage: number
    available: boolean
    inventoryQuantity: number
    images: string[]
    weight: number | null
    requiresShipping: boolean
    taxable: boolean
    shopifyVariantId: string | null
    position: number
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: ProductVariantCountAggregateOutputType | null
    _avg: ProductVariantAvgAggregateOutputType | null
    _sum: ProductVariantSumAggregateOutputType | null
    _min: ProductVariantMinAggregateOutputType | null
    _max: ProductVariantMaxAggregateOutputType | null
  }

  type GetProductVariantGroupByPayload<T extends ProductVariantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductVariantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductVariantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductVariantGroupByOutputType[P]>
            : GetScalarType<T[P], ProductVariantGroupByOutputType[P]>
        }
      >
    >


  export type ProductVariantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    parentVariantId?: boolean
    shopifyProductId?: boolean
    title?: boolean
    sku?: boolean
    price?: boolean
    discountedPrice?: boolean
    referralPercentage?: boolean
    available?: boolean
    inventoryQuantity?: boolean
    images?: boolean
    weight?: boolean
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: boolean
    position?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
    childVariants?: boolean | ProductVariant$childVariantsArgs<ExtArgs>
    _count?: boolean | ProductVariantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    parentVariantId?: boolean
    shopifyProductId?: boolean
    title?: boolean
    sku?: boolean
    price?: boolean
    discountedPrice?: boolean
    referralPercentage?: boolean
    available?: boolean
    inventoryQuantity?: boolean
    images?: boolean
    weight?: boolean
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: boolean
    position?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    productId?: boolean
    parentVariantId?: boolean
    shopifyProductId?: boolean
    title?: boolean
    sku?: boolean
    price?: boolean
    discountedPrice?: boolean
    referralPercentage?: boolean
    available?: boolean
    inventoryQuantity?: boolean
    images?: boolean
    weight?: boolean
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: boolean
    position?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
  }, ExtArgs["result"]["productVariant"]>

  export type ProductVariantSelectScalar = {
    id?: boolean
    productId?: boolean
    parentVariantId?: boolean
    shopifyProductId?: boolean
    title?: boolean
    sku?: boolean
    price?: boolean
    discountedPrice?: boolean
    referralPercentage?: boolean
    available?: boolean
    inventoryQuantity?: boolean
    images?: boolean
    weight?: boolean
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: boolean
    position?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type ProductVariantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "productId" | "parentVariantId" | "shopifyProductId" | "title" | "sku" | "price" | "discountedPrice" | "referralPercentage" | "available" | "inventoryQuantity" | "images" | "weight" | "requiresShipping" | "taxable" | "shopifyVariantId" | "position" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["productVariant"]>
  export type ProductVariantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
    childVariants?: boolean | ProductVariant$childVariantsArgs<ExtArgs>
    _count?: boolean | ProductVariantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductVariantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
  }
  export type ProductVariantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    product?: boolean | ProductDefaultArgs<ExtArgs>
    parentVariant?: boolean | ProductVariant$parentVariantArgs<ExtArgs>
  }

  export type $ProductVariantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductVariant"
    objects: {
      product: Prisma.$ProductPayload<ExtArgs>
      parentVariant: Prisma.$ProductVariantPayload<ExtArgs> | null
      childVariants: Prisma.$ProductVariantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      productId: number
      parentVariantId: number | null
      shopifyProductId: string | null
      title: string
      sku: string | null
      price: Prisma.Decimal | null
      discountedPrice: Prisma.Decimal | null
      referralPercentage: number
      available: boolean
      inventoryQuantity: number
      images: string[]
      weight: number | null
      requiresShipping: boolean
      taxable: boolean
      shopifyVariantId: string | null
      position: number
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["productVariant"]>
    composites: {}
  }

  type ProductVariantGetPayload<S extends boolean | null | undefined | ProductVariantDefaultArgs> = $Result.GetResult<Prisma.$ProductVariantPayload, S>

  type ProductVariantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductVariantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductVariantCountAggregateInputType | true
    }

  export interface ProductVariantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductVariant'], meta: { name: 'ProductVariant' } }
    /**
     * Find zero or one ProductVariant that matches the filter.
     * @param {ProductVariantFindUniqueArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductVariantFindUniqueArgs>(args: SelectSubset<T, ProductVariantFindUniqueArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductVariant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductVariantFindUniqueOrThrowArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductVariantFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductVariantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductVariant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindFirstArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductVariantFindFirstArgs>(args?: SelectSubset<T, ProductVariantFindFirstArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductVariant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindFirstOrThrowArgs} args - Arguments to find a ProductVariant
     * @example
     * // Get one ProductVariant
     * const productVariant = await prisma.productVariant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductVariantFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductVariantFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductVariants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductVariants
     * const productVariants = await prisma.productVariant.findMany()
     * 
     * // Get first 10 ProductVariants
     * const productVariants = await prisma.productVariant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductVariantFindManyArgs>(args?: SelectSubset<T, ProductVariantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductVariant.
     * @param {ProductVariantCreateArgs} args - Arguments to create a ProductVariant.
     * @example
     * // Create one ProductVariant
     * const ProductVariant = await prisma.productVariant.create({
     *   data: {
     *     // ... data to create a ProductVariant
     *   }
     * })
     * 
     */
    create<T extends ProductVariantCreateArgs>(args: SelectSubset<T, ProductVariantCreateArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductVariants.
     * @param {ProductVariantCreateManyArgs} args - Arguments to create many ProductVariants.
     * @example
     * // Create many ProductVariants
     * const productVariant = await prisma.productVariant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductVariantCreateManyArgs>(args?: SelectSubset<T, ProductVariantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductVariants and returns the data saved in the database.
     * @param {ProductVariantCreateManyAndReturnArgs} args - Arguments to create many ProductVariants.
     * @example
     * // Create many ProductVariants
     * const productVariant = await prisma.productVariant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductVariants and only return the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductVariantCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductVariantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductVariant.
     * @param {ProductVariantDeleteArgs} args - Arguments to delete one ProductVariant.
     * @example
     * // Delete one ProductVariant
     * const ProductVariant = await prisma.productVariant.delete({
     *   where: {
     *     // ... filter to delete one ProductVariant
     *   }
     * })
     * 
     */
    delete<T extends ProductVariantDeleteArgs>(args: SelectSubset<T, ProductVariantDeleteArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductVariant.
     * @param {ProductVariantUpdateArgs} args - Arguments to update one ProductVariant.
     * @example
     * // Update one ProductVariant
     * const productVariant = await prisma.productVariant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductVariantUpdateArgs>(args: SelectSubset<T, ProductVariantUpdateArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductVariants.
     * @param {ProductVariantDeleteManyArgs} args - Arguments to filter ProductVariants to delete.
     * @example
     * // Delete a few ProductVariants
     * const { count } = await prisma.productVariant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductVariantDeleteManyArgs>(args?: SelectSubset<T, ProductVariantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductVariants
     * const productVariant = await prisma.productVariant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductVariantUpdateManyArgs>(args: SelectSubset<T, ProductVariantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductVariants and returns the data updated in the database.
     * @param {ProductVariantUpdateManyAndReturnArgs} args - Arguments to update many ProductVariants.
     * @example
     * // Update many ProductVariants
     * const productVariant = await prisma.productVariant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductVariants and only return the `id`
     * const productVariantWithIdOnly = await prisma.productVariant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProductVariantUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductVariantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductVariant.
     * @param {ProductVariantUpsertArgs} args - Arguments to update or create a ProductVariant.
     * @example
     * // Update or create a ProductVariant
     * const productVariant = await prisma.productVariant.upsert({
     *   create: {
     *     // ... data to create a ProductVariant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductVariant we want to update
     *   }
     * })
     */
    upsert<T extends ProductVariantUpsertArgs>(args: SelectSubset<T, ProductVariantUpsertArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductVariants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantCountArgs} args - Arguments to filter ProductVariants to count.
     * @example
     * // Count the number of ProductVariants
     * const count = await prisma.productVariant.count({
     *   where: {
     *     // ... the filter for the ProductVariants we want to count
     *   }
     * })
    **/
    count<T extends ProductVariantCountArgs>(
      args?: Subset<T, ProductVariantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductVariantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProductVariantAggregateArgs>(args: Subset<T, ProductVariantAggregateArgs>): Prisma.PrismaPromise<GetProductVariantAggregateType<T>>

    /**
     * Group by ProductVariant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductVariantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProductVariantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductVariantGroupByArgs['orderBy'] }
        : { orderBy?: ProductVariantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProductVariantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductVariantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductVariant model
   */
  readonly fields: ProductVariantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductVariant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductVariantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    product<T extends ProductDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProductDefaultArgs<ExtArgs>>): Prisma__ProductClient<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parentVariant<T extends ProductVariant$parentVariantArgs<ExtArgs> = {}>(args?: Subset<T, ProductVariant$parentVariantArgs<ExtArgs>>): Prisma__ProductVariantClient<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    childVariants<T extends ProductVariant$childVariantsArgs<ExtArgs> = {}>(args?: Subset<T, ProductVariant$childVariantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductVariantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProductVariant model
   */
  interface ProductVariantFieldRefs {
    readonly id: FieldRef<"ProductVariant", 'Int'>
    readonly productId: FieldRef<"ProductVariant", 'Int'>
    readonly parentVariantId: FieldRef<"ProductVariant", 'Int'>
    readonly shopifyProductId: FieldRef<"ProductVariant", 'String'>
    readonly title: FieldRef<"ProductVariant", 'String'>
    readonly sku: FieldRef<"ProductVariant", 'String'>
    readonly price: FieldRef<"ProductVariant", 'Decimal'>
    readonly discountedPrice: FieldRef<"ProductVariant", 'Decimal'>
    readonly referralPercentage: FieldRef<"ProductVariant", 'Float'>
    readonly available: FieldRef<"ProductVariant", 'Boolean'>
    readonly inventoryQuantity: FieldRef<"ProductVariant", 'Int'>
    readonly images: FieldRef<"ProductVariant", 'String[]'>
    readonly weight: FieldRef<"ProductVariant", 'Int'>
    readonly requiresShipping: FieldRef<"ProductVariant", 'Boolean'>
    readonly taxable: FieldRef<"ProductVariant", 'Boolean'>
    readonly shopifyVariantId: FieldRef<"ProductVariant", 'String'>
    readonly position: FieldRef<"ProductVariant", 'Int'>
    readonly createdAt: FieldRef<"ProductVariant", 'DateTime'>
    readonly updatedAt: FieldRef<"ProductVariant", 'DateTime'>
    readonly enabled: FieldRef<"ProductVariant", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * ProductVariant findUnique
   */
  export type ProductVariantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant findUniqueOrThrow
   */
  export type ProductVariantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant findFirst
   */
  export type ProductVariantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductVariants.
     */
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant findFirstOrThrow
   */
  export type ProductVariantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariant to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductVariants.
     */
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant findMany
   */
  export type ProductVariantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter, which ProductVariants to fetch.
     */
    where?: ProductVariantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductVariants to fetch.
     */
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductVariants.
     */
    cursor?: ProductVariantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductVariants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductVariants.
     */
    skip?: number
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant create
   */
  export type ProductVariantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductVariant.
     */
    data: XOR<ProductVariantCreateInput, ProductVariantUncheckedCreateInput>
  }

  /**
   * ProductVariant createMany
   */
  export type ProductVariantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductVariants.
     */
    data: ProductVariantCreateManyInput | ProductVariantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductVariant createManyAndReturn
   */
  export type ProductVariantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * The data used to create many ProductVariants.
     */
    data: ProductVariantCreateManyInput | ProductVariantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductVariant update
   */
  export type ProductVariantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductVariant.
     */
    data: XOR<ProductVariantUpdateInput, ProductVariantUncheckedUpdateInput>
    /**
     * Choose, which ProductVariant to update.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant updateMany
   */
  export type ProductVariantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductVariants.
     */
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductVariants to update
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to update.
     */
    limit?: number
  }

  /**
   * ProductVariant updateManyAndReturn
   */
  export type ProductVariantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * The data used to update ProductVariants.
     */
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyInput>
    /**
     * Filter which ProductVariants to update
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductVariant upsert
   */
  export type ProductVariantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductVariant to update in case it exists.
     */
    where: ProductVariantWhereUniqueInput
    /**
     * In case the ProductVariant found by the `where` argument doesn't exist, create a new ProductVariant with this data.
     */
    create: XOR<ProductVariantCreateInput, ProductVariantUncheckedCreateInput>
    /**
     * In case the ProductVariant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductVariantUpdateInput, ProductVariantUncheckedUpdateInput>
  }

  /**
   * ProductVariant delete
   */
  export type ProductVariantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    /**
     * Filter which ProductVariant to delete.
     */
    where: ProductVariantWhereUniqueInput
  }

  /**
   * ProductVariant deleteMany
   */
  export type ProductVariantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductVariants to delete
     */
    where?: ProductVariantWhereInput
    /**
     * Limit how many ProductVariants to delete.
     */
    limit?: number
  }

  /**
   * ProductVariant.parentVariant
   */
  export type ProductVariant$parentVariantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    where?: ProductVariantWhereInput
  }

  /**
   * ProductVariant.childVariants
   */
  export type ProductVariant$childVariantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
    where?: ProductVariantWhereInput
    orderBy?: ProductVariantOrderByWithRelationInput | ProductVariantOrderByWithRelationInput[]
    cursor?: ProductVariantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductVariantScalarFieldEnum | ProductVariantScalarFieldEnum[]
  }

  /**
   * ProductVariant without action
   */
  export type ProductVariantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductVariant
     */
    select?: ProductVariantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductVariant
     */
    omit?: ProductVariantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductVariantInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagAvgAggregateOutputType = {
    id: number | null
  }

  export type TagSumAggregateOutputType = {
    id: number | null
  }

  export type TagMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type TagMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
    enabled: boolean | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    createdAt: number
    updatedAt: number
    enabled: number
    _all: number
  }


  export type TagAvgAggregateInputType = {
    id?: true
  }

  export type TagSumAggregateInputType = {
    id?: true
  }

  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    enabled?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TagAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TagSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _avg?: TagAvgAggregateInputType
    _sum?: TagSumAggregateInputType
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
    products?: boolean | Tag$productsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    enabled?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "createdAt" | "updatedAt" | "enabled", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    products?: boolean | Tag$productsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      products: Prisma.$ProductPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string | null
      createdAt: Date
      updatedAt: Date
      enabled: boolean
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    products<T extends Tag$productsArgs<ExtArgs> = {}>(args?: Subset<T, Tag$productsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'Int'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly slug: FieldRef<"Tag", 'String'>
    readonly description: FieldRef<"Tag", 'String'>
    readonly createdAt: FieldRef<"Tag", 'DateTime'>
    readonly updatedAt: FieldRef<"Tag", 'DateTime'>
    readonly enabled: FieldRef<"Tag", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.products
   */
  export type Tag$productsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Product
     */
    select?: ProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Product
     */
    omit?: ProductOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductInclude<ExtArgs> | null
    where?: ProductWhereInput
    orderBy?: ProductOrderByWithRelationInput | ProductOrderByWithRelationInput[]
    cursor?: ProductWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductScalarFieldEnum | ProductScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model ReferralLog
   */

  export type AggregateReferralLog = {
    _count: ReferralLogCountAggregateOutputType | null
    _avg: ReferralLogAvgAggregateOutputType | null
    _sum: ReferralLogSumAggregateOutputType | null
    _min: ReferralLogMinAggregateOutputType | null
    _max: ReferralLogMaxAggregateOutputType | null
  }

  export type ReferralLogAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
  }

  export type ReferralLogSumAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
  }

  export type ReferralLogMinAggregateOutputType = {
    id: number | null
    userId: number | null
    codeUsed: string | null
    refererId: number | null
    createdAt: Date | null
  }

  export type ReferralLogMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    codeUsed: string | null
    refererId: number | null
    createdAt: Date | null
  }

  export type ReferralLogCountAggregateOutputType = {
    id: number
    userId: number
    codeUsed: number
    refererId: number
    createdAt: number
    _all: number
  }


  export type ReferralLogAvgAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
  }

  export type ReferralLogSumAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
  }

  export type ReferralLogMinAggregateInputType = {
    id?: true
    userId?: true
    codeUsed?: true
    refererId?: true
    createdAt?: true
  }

  export type ReferralLogMaxAggregateInputType = {
    id?: true
    userId?: true
    codeUsed?: true
    refererId?: true
    createdAt?: true
  }

  export type ReferralLogCountAggregateInputType = {
    id?: true
    userId?: true
    codeUsed?: true
    refererId?: true
    createdAt?: true
    _all?: true
  }

  export type ReferralLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReferralLog to aggregate.
     */
    where?: ReferralLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralLogs to fetch.
     */
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReferralLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReferralLogs
    **/
    _count?: true | ReferralLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReferralLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReferralLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReferralLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReferralLogMaxAggregateInputType
  }

  export type GetReferralLogAggregateType<T extends ReferralLogAggregateArgs> = {
        [P in keyof T & keyof AggregateReferralLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReferralLog[P]>
      : GetScalarType<T[P], AggregateReferralLog[P]>
  }




  export type ReferralLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralLogWhereInput
    orderBy?: ReferralLogOrderByWithAggregationInput | ReferralLogOrderByWithAggregationInput[]
    by: ReferralLogScalarFieldEnum[] | ReferralLogScalarFieldEnum
    having?: ReferralLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReferralLogCountAggregateInputType | true
    _avg?: ReferralLogAvgAggregateInputType
    _sum?: ReferralLogSumAggregateInputType
    _min?: ReferralLogMinAggregateInputType
    _max?: ReferralLogMaxAggregateInputType
  }

  export type ReferralLogGroupByOutputType = {
    id: number
    userId: number
    codeUsed: string
    refererId: number
    createdAt: Date
    _count: ReferralLogCountAggregateOutputType | null
    _avg: ReferralLogAvgAggregateOutputType | null
    _sum: ReferralLogSumAggregateOutputType | null
    _min: ReferralLogMinAggregateOutputType | null
    _max: ReferralLogMaxAggregateOutputType | null
  }

  type GetReferralLogGroupByPayload<T extends ReferralLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReferralLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReferralLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReferralLogGroupByOutputType[P]>
            : GetScalarType<T[P], ReferralLogGroupByOutputType[P]>
        }
      >
    >


  export type ReferralLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeUsed?: boolean
    refererId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralLog"]>

  export type ReferralLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeUsed?: boolean
    refererId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralLog"]>

  export type ReferralLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeUsed?: boolean
    refererId?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralLog"]>

  export type ReferralLogSelectScalar = {
    id?: boolean
    userId?: boolean
    codeUsed?: boolean
    refererId?: boolean
    createdAt?: boolean
  }

  export type ReferralLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "codeUsed" | "refererId" | "createdAt", ExtArgs["result"]["referralLog"]>
  export type ReferralLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReferralLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReferralLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReferralLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReferralLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      referer: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      codeUsed: string
      refererId: number
      createdAt: Date
    }, ExtArgs["result"]["referralLog"]>
    composites: {}
  }

  type ReferralLogGetPayload<S extends boolean | null | undefined | ReferralLogDefaultArgs> = $Result.GetResult<Prisma.$ReferralLogPayload, S>

  type ReferralLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReferralLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReferralLogCountAggregateInputType | true
    }

  export interface ReferralLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReferralLog'], meta: { name: 'ReferralLog' } }
    /**
     * Find zero or one ReferralLog that matches the filter.
     * @param {ReferralLogFindUniqueArgs} args - Arguments to find a ReferralLog
     * @example
     * // Get one ReferralLog
     * const referralLog = await prisma.referralLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReferralLogFindUniqueArgs>(args: SelectSubset<T, ReferralLogFindUniqueArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReferralLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReferralLogFindUniqueOrThrowArgs} args - Arguments to find a ReferralLog
     * @example
     * // Get one ReferralLog
     * const referralLog = await prisma.referralLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReferralLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ReferralLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReferralLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogFindFirstArgs} args - Arguments to find a ReferralLog
     * @example
     * // Get one ReferralLog
     * const referralLog = await prisma.referralLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReferralLogFindFirstArgs>(args?: SelectSubset<T, ReferralLogFindFirstArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReferralLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogFindFirstOrThrowArgs} args - Arguments to find a ReferralLog
     * @example
     * // Get one ReferralLog
     * const referralLog = await prisma.referralLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReferralLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ReferralLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReferralLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReferralLogs
     * const referralLogs = await prisma.referralLog.findMany()
     * 
     * // Get first 10 ReferralLogs
     * const referralLogs = await prisma.referralLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const referralLogWithIdOnly = await prisma.referralLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReferralLogFindManyArgs>(args?: SelectSubset<T, ReferralLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReferralLog.
     * @param {ReferralLogCreateArgs} args - Arguments to create a ReferralLog.
     * @example
     * // Create one ReferralLog
     * const ReferralLog = await prisma.referralLog.create({
     *   data: {
     *     // ... data to create a ReferralLog
     *   }
     * })
     * 
     */
    create<T extends ReferralLogCreateArgs>(args: SelectSubset<T, ReferralLogCreateArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReferralLogs.
     * @param {ReferralLogCreateManyArgs} args - Arguments to create many ReferralLogs.
     * @example
     * // Create many ReferralLogs
     * const referralLog = await prisma.referralLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReferralLogCreateManyArgs>(args?: SelectSubset<T, ReferralLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReferralLogs and returns the data saved in the database.
     * @param {ReferralLogCreateManyAndReturnArgs} args - Arguments to create many ReferralLogs.
     * @example
     * // Create many ReferralLogs
     * const referralLog = await prisma.referralLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReferralLogs and only return the `id`
     * const referralLogWithIdOnly = await prisma.referralLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReferralLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ReferralLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReferralLog.
     * @param {ReferralLogDeleteArgs} args - Arguments to delete one ReferralLog.
     * @example
     * // Delete one ReferralLog
     * const ReferralLog = await prisma.referralLog.delete({
     *   where: {
     *     // ... filter to delete one ReferralLog
     *   }
     * })
     * 
     */
    delete<T extends ReferralLogDeleteArgs>(args: SelectSubset<T, ReferralLogDeleteArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReferralLog.
     * @param {ReferralLogUpdateArgs} args - Arguments to update one ReferralLog.
     * @example
     * // Update one ReferralLog
     * const referralLog = await prisma.referralLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReferralLogUpdateArgs>(args: SelectSubset<T, ReferralLogUpdateArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReferralLogs.
     * @param {ReferralLogDeleteManyArgs} args - Arguments to filter ReferralLogs to delete.
     * @example
     * // Delete a few ReferralLogs
     * const { count } = await prisma.referralLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReferralLogDeleteManyArgs>(args?: SelectSubset<T, ReferralLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReferralLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReferralLogs
     * const referralLog = await prisma.referralLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReferralLogUpdateManyArgs>(args: SelectSubset<T, ReferralLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReferralLogs and returns the data updated in the database.
     * @param {ReferralLogUpdateManyAndReturnArgs} args - Arguments to update many ReferralLogs.
     * @example
     * // Update many ReferralLogs
     * const referralLog = await prisma.referralLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReferralLogs and only return the `id`
     * const referralLogWithIdOnly = await prisma.referralLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReferralLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ReferralLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReferralLog.
     * @param {ReferralLogUpsertArgs} args - Arguments to update or create a ReferralLog.
     * @example
     * // Update or create a ReferralLog
     * const referralLog = await prisma.referralLog.upsert({
     *   create: {
     *     // ... data to create a ReferralLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReferralLog we want to update
     *   }
     * })
     */
    upsert<T extends ReferralLogUpsertArgs>(args: SelectSubset<T, ReferralLogUpsertArgs<ExtArgs>>): Prisma__ReferralLogClient<$Result.GetResult<Prisma.$ReferralLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReferralLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogCountArgs} args - Arguments to filter ReferralLogs to count.
     * @example
     * // Count the number of ReferralLogs
     * const count = await prisma.referralLog.count({
     *   where: {
     *     // ... the filter for the ReferralLogs we want to count
     *   }
     * })
    **/
    count<T extends ReferralLogCountArgs>(
      args?: Subset<T, ReferralLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReferralLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReferralLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReferralLogAggregateArgs>(args: Subset<T, ReferralLogAggregateArgs>): Prisma.PrismaPromise<GetReferralLogAggregateType<T>>

    /**
     * Group by ReferralLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReferralLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReferralLogGroupByArgs['orderBy'] }
        : { orderBy?: ReferralLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReferralLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReferralLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReferralLog model
   */
  readonly fields: ReferralLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReferralLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReferralLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    referer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReferralLog model
   */
  interface ReferralLogFieldRefs {
    readonly id: FieldRef<"ReferralLog", 'Int'>
    readonly userId: FieldRef<"ReferralLog", 'Int'>
    readonly codeUsed: FieldRef<"ReferralLog", 'String'>
    readonly refererId: FieldRef<"ReferralLog", 'Int'>
    readonly createdAt: FieldRef<"ReferralLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReferralLog findUnique
   */
  export type ReferralLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralLog to fetch.
     */
    where: ReferralLogWhereUniqueInput
  }

  /**
   * ReferralLog findUniqueOrThrow
   */
  export type ReferralLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralLog to fetch.
     */
    where: ReferralLogWhereUniqueInput
  }

  /**
   * ReferralLog findFirst
   */
  export type ReferralLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralLog to fetch.
     */
    where?: ReferralLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralLogs to fetch.
     */
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReferralLogs.
     */
    cursor?: ReferralLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReferralLogs.
     */
    distinct?: ReferralLogScalarFieldEnum | ReferralLogScalarFieldEnum[]
  }

  /**
   * ReferralLog findFirstOrThrow
   */
  export type ReferralLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralLog to fetch.
     */
    where?: ReferralLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralLogs to fetch.
     */
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReferralLogs.
     */
    cursor?: ReferralLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReferralLogs.
     */
    distinct?: ReferralLogScalarFieldEnum | ReferralLogScalarFieldEnum[]
  }

  /**
   * ReferralLog findMany
   */
  export type ReferralLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralLogs to fetch.
     */
    where?: ReferralLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralLogs to fetch.
     */
    orderBy?: ReferralLogOrderByWithRelationInput | ReferralLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReferralLogs.
     */
    cursor?: ReferralLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralLogs.
     */
    skip?: number
    distinct?: ReferralLogScalarFieldEnum | ReferralLogScalarFieldEnum[]
  }

  /**
   * ReferralLog create
   */
  export type ReferralLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ReferralLog.
     */
    data: XOR<ReferralLogCreateInput, ReferralLogUncheckedCreateInput>
  }

  /**
   * ReferralLog createMany
   */
  export type ReferralLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReferralLogs.
     */
    data: ReferralLogCreateManyInput | ReferralLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReferralLog createManyAndReturn
   */
  export type ReferralLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * The data used to create many ReferralLogs.
     */
    data: ReferralLogCreateManyInput | ReferralLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReferralLog update
   */
  export type ReferralLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ReferralLog.
     */
    data: XOR<ReferralLogUpdateInput, ReferralLogUncheckedUpdateInput>
    /**
     * Choose, which ReferralLog to update.
     */
    where: ReferralLogWhereUniqueInput
  }

  /**
   * ReferralLog updateMany
   */
  export type ReferralLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReferralLogs.
     */
    data: XOR<ReferralLogUpdateManyMutationInput, ReferralLogUncheckedUpdateManyInput>
    /**
     * Filter which ReferralLogs to update
     */
    where?: ReferralLogWhereInput
    /**
     * Limit how many ReferralLogs to update.
     */
    limit?: number
  }

  /**
   * ReferralLog updateManyAndReturn
   */
  export type ReferralLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * The data used to update ReferralLogs.
     */
    data: XOR<ReferralLogUpdateManyMutationInput, ReferralLogUncheckedUpdateManyInput>
    /**
     * Filter which ReferralLogs to update
     */
    where?: ReferralLogWhereInput
    /**
     * Limit how many ReferralLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReferralLog upsert
   */
  export type ReferralLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ReferralLog to update in case it exists.
     */
    where: ReferralLogWhereUniqueInput
    /**
     * In case the ReferralLog found by the `where` argument doesn't exist, create a new ReferralLog with this data.
     */
    create: XOR<ReferralLogCreateInput, ReferralLogUncheckedCreateInput>
    /**
     * In case the ReferralLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReferralLogUpdateInput, ReferralLogUncheckedUpdateInput>
  }

  /**
   * ReferralLog delete
   */
  export type ReferralLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
    /**
     * Filter which ReferralLog to delete.
     */
    where: ReferralLogWhereUniqueInput
  }

  /**
   * ReferralLog deleteMany
   */
  export type ReferralLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReferralLogs to delete
     */
    where?: ReferralLogWhereInput
    /**
     * Limit how many ReferralLogs to delete.
     */
    limit?: number
  }

  /**
   * ReferralLog without action
   */
  export type ReferralLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralLog
     */
    select?: ReferralLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralLog
     */
    omit?: ReferralLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralLogInclude<ExtArgs> | null
  }


  /**
   * Model ReferralEarningsLog
   */

  export type AggregateReferralEarningsLog = {
    _count: ReferralEarningsLogCountAggregateOutputType | null
    _avg: ReferralEarningsLogAvgAggregateOutputType | null
    _sum: ReferralEarningsLogSumAggregateOutputType | null
    _min: ReferralEarningsLogMinAggregateOutputType | null
    _max: ReferralEarningsLogMaxAggregateOutputType | null
  }

  export type ReferralEarningsLogAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
    amount: Decimal | null
  }

  export type ReferralEarningsLogSumAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
    amount: Decimal | null
  }

  export type ReferralEarningsLogMinAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
    shopifyOrderId: string | null
    amount: Decimal | null
    createdAt: Date | null
  }

  export type ReferralEarningsLogMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    refererId: number | null
    shopifyOrderId: string | null
    amount: Decimal | null
    createdAt: Date | null
  }

  export type ReferralEarningsLogCountAggregateOutputType = {
    id: number
    userId: number
    refererId: number
    shopifyOrderId: number
    amount: number
    createdAt: number
    _all: number
  }


  export type ReferralEarningsLogAvgAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
    amount?: true
  }

  export type ReferralEarningsLogSumAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
    amount?: true
  }

  export type ReferralEarningsLogMinAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
    shopifyOrderId?: true
    amount?: true
    createdAt?: true
  }

  export type ReferralEarningsLogMaxAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
    shopifyOrderId?: true
    amount?: true
    createdAt?: true
  }

  export type ReferralEarningsLogCountAggregateInputType = {
    id?: true
    userId?: true
    refererId?: true
    shopifyOrderId?: true
    amount?: true
    createdAt?: true
    _all?: true
  }

  export type ReferralEarningsLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReferralEarningsLog to aggregate.
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralEarningsLogs to fetch.
     */
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReferralEarningsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralEarningsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralEarningsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReferralEarningsLogs
    **/
    _count?: true | ReferralEarningsLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReferralEarningsLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReferralEarningsLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReferralEarningsLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReferralEarningsLogMaxAggregateInputType
  }

  export type GetReferralEarningsLogAggregateType<T extends ReferralEarningsLogAggregateArgs> = {
        [P in keyof T & keyof AggregateReferralEarningsLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReferralEarningsLog[P]>
      : GetScalarType<T[P], AggregateReferralEarningsLog[P]>
  }




  export type ReferralEarningsLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReferralEarningsLogWhereInput
    orderBy?: ReferralEarningsLogOrderByWithAggregationInput | ReferralEarningsLogOrderByWithAggregationInput[]
    by: ReferralEarningsLogScalarFieldEnum[] | ReferralEarningsLogScalarFieldEnum
    having?: ReferralEarningsLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReferralEarningsLogCountAggregateInputType | true
    _avg?: ReferralEarningsLogAvgAggregateInputType
    _sum?: ReferralEarningsLogSumAggregateInputType
    _min?: ReferralEarningsLogMinAggregateInputType
    _max?: ReferralEarningsLogMaxAggregateInputType
  }

  export type ReferralEarningsLogGroupByOutputType = {
    id: number
    userId: number
    refererId: number
    shopifyOrderId: string | null
    amount: Decimal
    createdAt: Date
    _count: ReferralEarningsLogCountAggregateOutputType | null
    _avg: ReferralEarningsLogAvgAggregateOutputType | null
    _sum: ReferralEarningsLogSumAggregateOutputType | null
    _min: ReferralEarningsLogMinAggregateOutputType | null
    _max: ReferralEarningsLogMaxAggregateOutputType | null
  }

  type GetReferralEarningsLogGroupByPayload<T extends ReferralEarningsLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReferralEarningsLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReferralEarningsLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReferralEarningsLogGroupByOutputType[P]>
            : GetScalarType<T[P], ReferralEarningsLogGroupByOutputType[P]>
        }
      >
    >


  export type ReferralEarningsLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refererId?: boolean
    shopifyOrderId?: boolean
    amount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralEarningsLog"]>

  export type ReferralEarningsLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refererId?: boolean
    shopifyOrderId?: boolean
    amount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralEarningsLog"]>

  export type ReferralEarningsLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refererId?: boolean
    shopifyOrderId?: boolean
    amount?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["referralEarningsLog"]>

  export type ReferralEarningsLogSelectScalar = {
    id?: boolean
    userId?: boolean
    refererId?: boolean
    shopifyOrderId?: boolean
    amount?: boolean
    createdAt?: boolean
  }

  export type ReferralEarningsLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refererId" | "shopifyOrderId" | "amount" | "createdAt", ExtArgs["result"]["referralEarningsLog"]>
  export type ReferralEarningsLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReferralEarningsLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ReferralEarningsLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    referer?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ReferralEarningsLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReferralEarningsLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      referer: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      refererId: number
      shopifyOrderId: string | null
      amount: Prisma.Decimal
      createdAt: Date
    }, ExtArgs["result"]["referralEarningsLog"]>
    composites: {}
  }

  type ReferralEarningsLogGetPayload<S extends boolean | null | undefined | ReferralEarningsLogDefaultArgs> = $Result.GetResult<Prisma.$ReferralEarningsLogPayload, S>

  type ReferralEarningsLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReferralEarningsLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReferralEarningsLogCountAggregateInputType | true
    }

  export interface ReferralEarningsLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReferralEarningsLog'], meta: { name: 'ReferralEarningsLog' } }
    /**
     * Find zero or one ReferralEarningsLog that matches the filter.
     * @param {ReferralEarningsLogFindUniqueArgs} args - Arguments to find a ReferralEarningsLog
     * @example
     * // Get one ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReferralEarningsLogFindUniqueArgs>(args: SelectSubset<T, ReferralEarningsLogFindUniqueArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReferralEarningsLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReferralEarningsLogFindUniqueOrThrowArgs} args - Arguments to find a ReferralEarningsLog
     * @example
     * // Get one ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReferralEarningsLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ReferralEarningsLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReferralEarningsLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogFindFirstArgs} args - Arguments to find a ReferralEarningsLog
     * @example
     * // Get one ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReferralEarningsLogFindFirstArgs>(args?: SelectSubset<T, ReferralEarningsLogFindFirstArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReferralEarningsLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogFindFirstOrThrowArgs} args - Arguments to find a ReferralEarningsLog
     * @example
     * // Get one ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReferralEarningsLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ReferralEarningsLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReferralEarningsLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReferralEarningsLogs
     * const referralEarningsLogs = await prisma.referralEarningsLog.findMany()
     * 
     * // Get first 10 ReferralEarningsLogs
     * const referralEarningsLogs = await prisma.referralEarningsLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const referralEarningsLogWithIdOnly = await prisma.referralEarningsLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReferralEarningsLogFindManyArgs>(args?: SelectSubset<T, ReferralEarningsLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReferralEarningsLog.
     * @param {ReferralEarningsLogCreateArgs} args - Arguments to create a ReferralEarningsLog.
     * @example
     * // Create one ReferralEarningsLog
     * const ReferralEarningsLog = await prisma.referralEarningsLog.create({
     *   data: {
     *     // ... data to create a ReferralEarningsLog
     *   }
     * })
     * 
     */
    create<T extends ReferralEarningsLogCreateArgs>(args: SelectSubset<T, ReferralEarningsLogCreateArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReferralEarningsLogs.
     * @param {ReferralEarningsLogCreateManyArgs} args - Arguments to create many ReferralEarningsLogs.
     * @example
     * // Create many ReferralEarningsLogs
     * const referralEarningsLog = await prisma.referralEarningsLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReferralEarningsLogCreateManyArgs>(args?: SelectSubset<T, ReferralEarningsLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReferralEarningsLogs and returns the data saved in the database.
     * @param {ReferralEarningsLogCreateManyAndReturnArgs} args - Arguments to create many ReferralEarningsLogs.
     * @example
     * // Create many ReferralEarningsLogs
     * const referralEarningsLog = await prisma.referralEarningsLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReferralEarningsLogs and only return the `id`
     * const referralEarningsLogWithIdOnly = await prisma.referralEarningsLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReferralEarningsLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ReferralEarningsLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReferralEarningsLog.
     * @param {ReferralEarningsLogDeleteArgs} args - Arguments to delete one ReferralEarningsLog.
     * @example
     * // Delete one ReferralEarningsLog
     * const ReferralEarningsLog = await prisma.referralEarningsLog.delete({
     *   where: {
     *     // ... filter to delete one ReferralEarningsLog
     *   }
     * })
     * 
     */
    delete<T extends ReferralEarningsLogDeleteArgs>(args: SelectSubset<T, ReferralEarningsLogDeleteArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReferralEarningsLog.
     * @param {ReferralEarningsLogUpdateArgs} args - Arguments to update one ReferralEarningsLog.
     * @example
     * // Update one ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReferralEarningsLogUpdateArgs>(args: SelectSubset<T, ReferralEarningsLogUpdateArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReferralEarningsLogs.
     * @param {ReferralEarningsLogDeleteManyArgs} args - Arguments to filter ReferralEarningsLogs to delete.
     * @example
     * // Delete a few ReferralEarningsLogs
     * const { count } = await prisma.referralEarningsLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReferralEarningsLogDeleteManyArgs>(args?: SelectSubset<T, ReferralEarningsLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReferralEarningsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReferralEarningsLogs
     * const referralEarningsLog = await prisma.referralEarningsLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReferralEarningsLogUpdateManyArgs>(args: SelectSubset<T, ReferralEarningsLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReferralEarningsLogs and returns the data updated in the database.
     * @param {ReferralEarningsLogUpdateManyAndReturnArgs} args - Arguments to update many ReferralEarningsLogs.
     * @example
     * // Update many ReferralEarningsLogs
     * const referralEarningsLog = await prisma.referralEarningsLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReferralEarningsLogs and only return the `id`
     * const referralEarningsLogWithIdOnly = await prisma.referralEarningsLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReferralEarningsLogUpdateManyAndReturnArgs>(args: SelectSubset<T, ReferralEarningsLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReferralEarningsLog.
     * @param {ReferralEarningsLogUpsertArgs} args - Arguments to update or create a ReferralEarningsLog.
     * @example
     * // Update or create a ReferralEarningsLog
     * const referralEarningsLog = await prisma.referralEarningsLog.upsert({
     *   create: {
     *     // ... data to create a ReferralEarningsLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReferralEarningsLog we want to update
     *   }
     * })
     */
    upsert<T extends ReferralEarningsLogUpsertArgs>(args: SelectSubset<T, ReferralEarningsLogUpsertArgs<ExtArgs>>): Prisma__ReferralEarningsLogClient<$Result.GetResult<Prisma.$ReferralEarningsLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReferralEarningsLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogCountArgs} args - Arguments to filter ReferralEarningsLogs to count.
     * @example
     * // Count the number of ReferralEarningsLogs
     * const count = await prisma.referralEarningsLog.count({
     *   where: {
     *     // ... the filter for the ReferralEarningsLogs we want to count
     *   }
     * })
    **/
    count<T extends ReferralEarningsLogCountArgs>(
      args?: Subset<T, ReferralEarningsLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReferralEarningsLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReferralEarningsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReferralEarningsLogAggregateArgs>(args: Subset<T, ReferralEarningsLogAggregateArgs>): Prisma.PrismaPromise<GetReferralEarningsLogAggregateType<T>>

    /**
     * Group by ReferralEarningsLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReferralEarningsLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReferralEarningsLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReferralEarningsLogGroupByArgs['orderBy'] }
        : { orderBy?: ReferralEarningsLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReferralEarningsLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReferralEarningsLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReferralEarningsLog model
   */
  readonly fields: ReferralEarningsLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReferralEarningsLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReferralEarningsLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    referer<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReferralEarningsLog model
   */
  interface ReferralEarningsLogFieldRefs {
    readonly id: FieldRef<"ReferralEarningsLog", 'Int'>
    readonly userId: FieldRef<"ReferralEarningsLog", 'Int'>
    readonly refererId: FieldRef<"ReferralEarningsLog", 'Int'>
    readonly shopifyOrderId: FieldRef<"ReferralEarningsLog", 'String'>
    readonly amount: FieldRef<"ReferralEarningsLog", 'Decimal'>
    readonly createdAt: FieldRef<"ReferralEarningsLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReferralEarningsLog findUnique
   */
  export type ReferralEarningsLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralEarningsLog to fetch.
     */
    where: ReferralEarningsLogWhereUniqueInput
  }

  /**
   * ReferralEarningsLog findUniqueOrThrow
   */
  export type ReferralEarningsLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralEarningsLog to fetch.
     */
    where: ReferralEarningsLogWhereUniqueInput
  }

  /**
   * ReferralEarningsLog findFirst
   */
  export type ReferralEarningsLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralEarningsLog to fetch.
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralEarningsLogs to fetch.
     */
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReferralEarningsLogs.
     */
    cursor?: ReferralEarningsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralEarningsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralEarningsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReferralEarningsLogs.
     */
    distinct?: ReferralEarningsLogScalarFieldEnum | ReferralEarningsLogScalarFieldEnum[]
  }

  /**
   * ReferralEarningsLog findFirstOrThrow
   */
  export type ReferralEarningsLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralEarningsLog to fetch.
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralEarningsLogs to fetch.
     */
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReferralEarningsLogs.
     */
    cursor?: ReferralEarningsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralEarningsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralEarningsLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReferralEarningsLogs.
     */
    distinct?: ReferralEarningsLogScalarFieldEnum | ReferralEarningsLogScalarFieldEnum[]
  }

  /**
   * ReferralEarningsLog findMany
   */
  export type ReferralEarningsLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter, which ReferralEarningsLogs to fetch.
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReferralEarningsLogs to fetch.
     */
    orderBy?: ReferralEarningsLogOrderByWithRelationInput | ReferralEarningsLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReferralEarningsLogs.
     */
    cursor?: ReferralEarningsLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReferralEarningsLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReferralEarningsLogs.
     */
    skip?: number
    distinct?: ReferralEarningsLogScalarFieldEnum | ReferralEarningsLogScalarFieldEnum[]
  }

  /**
   * ReferralEarningsLog create
   */
  export type ReferralEarningsLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * The data needed to create a ReferralEarningsLog.
     */
    data: XOR<ReferralEarningsLogCreateInput, ReferralEarningsLogUncheckedCreateInput>
  }

  /**
   * ReferralEarningsLog createMany
   */
  export type ReferralEarningsLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReferralEarningsLogs.
     */
    data: ReferralEarningsLogCreateManyInput | ReferralEarningsLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReferralEarningsLog createManyAndReturn
   */
  export type ReferralEarningsLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * The data used to create many ReferralEarningsLogs.
     */
    data: ReferralEarningsLogCreateManyInput | ReferralEarningsLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReferralEarningsLog update
   */
  export type ReferralEarningsLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * The data needed to update a ReferralEarningsLog.
     */
    data: XOR<ReferralEarningsLogUpdateInput, ReferralEarningsLogUncheckedUpdateInput>
    /**
     * Choose, which ReferralEarningsLog to update.
     */
    where: ReferralEarningsLogWhereUniqueInput
  }

  /**
   * ReferralEarningsLog updateMany
   */
  export type ReferralEarningsLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReferralEarningsLogs.
     */
    data: XOR<ReferralEarningsLogUpdateManyMutationInput, ReferralEarningsLogUncheckedUpdateManyInput>
    /**
     * Filter which ReferralEarningsLogs to update
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * Limit how many ReferralEarningsLogs to update.
     */
    limit?: number
  }

  /**
   * ReferralEarningsLog updateManyAndReturn
   */
  export type ReferralEarningsLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * The data used to update ReferralEarningsLogs.
     */
    data: XOR<ReferralEarningsLogUpdateManyMutationInput, ReferralEarningsLogUncheckedUpdateManyInput>
    /**
     * Filter which ReferralEarningsLogs to update
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * Limit how many ReferralEarningsLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ReferralEarningsLog upsert
   */
  export type ReferralEarningsLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * The filter to search for the ReferralEarningsLog to update in case it exists.
     */
    where: ReferralEarningsLogWhereUniqueInput
    /**
     * In case the ReferralEarningsLog found by the `where` argument doesn't exist, create a new ReferralEarningsLog with this data.
     */
    create: XOR<ReferralEarningsLogCreateInput, ReferralEarningsLogUncheckedCreateInput>
    /**
     * In case the ReferralEarningsLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReferralEarningsLogUpdateInput, ReferralEarningsLogUncheckedUpdateInput>
  }

  /**
   * ReferralEarningsLog delete
   */
  export type ReferralEarningsLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
    /**
     * Filter which ReferralEarningsLog to delete.
     */
    where: ReferralEarningsLogWhereUniqueInput
  }

  /**
   * ReferralEarningsLog deleteMany
   */
  export type ReferralEarningsLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReferralEarningsLogs to delete
     */
    where?: ReferralEarningsLogWhereInput
    /**
     * Limit how many ReferralEarningsLogs to delete.
     */
    limit?: number
  }

  /**
   * ReferralEarningsLog without action
   */
  export type ReferralEarningsLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReferralEarningsLog
     */
    select?: ReferralEarningsLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReferralEarningsLog
     */
    omit?: ReferralEarningsLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReferralEarningsLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    role: 'role',
    referralCode: 'referralCode',
    referrerId: 'referrerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled',
    totalReferralEarnings: 'totalReferralEarnings',
    withdrawableBalance: 'withdrawableBalance',
    totalReferredUsers: 'totalReferredUsers'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EmailOtpScalarFieldEnum: {
    id: 'id',
    email: 'email',
    otp: 'otp',
    expiresAt: 'expiresAt',
    wrongAttempts: 'wrongAttempts',
    blockedUntil: 'blockedUntil',
    resendCount: 'resendCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type EmailOtpScalarFieldEnum = (typeof EmailOtpScalarFieldEnum)[keyof typeof EmailOtpScalarFieldEnum]


  export const VendorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type VendorScalarFieldEnum = (typeof VendorScalarFieldEnum)[keyof typeof VendorScalarFieldEnum]


  export const ProductTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type ProductTypeScalarFieldEnum = (typeof ProductTypeScalarFieldEnum)[keyof typeof ProductTypeScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const ProductScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    vendorId: 'vendorId',
    productTypeId: 'productTypeId',
    published: 'published',
    publishedAt: 'publishedAt',
    price: 'price',
    discountedPrice: 'discountedPrice',
    sku: 'sku',
    inventoryQuantity: 'inventoryQuantity',
    available: 'available',
    referralPercentage: 'referralPercentage',
    shopifyProductId: 'shopifyProductId',
    images: 'images',
    categoryId: 'categoryId',
    tagId: 'tagId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type ProductScalarFieldEnum = (typeof ProductScalarFieldEnum)[keyof typeof ProductScalarFieldEnum]


  export const ProductVariantScalarFieldEnum: {
    id: 'id',
    productId: 'productId',
    parentVariantId: 'parentVariantId',
    shopifyProductId: 'shopifyProductId',
    title: 'title',
    sku: 'sku',
    price: 'price',
    discountedPrice: 'discountedPrice',
    referralPercentage: 'referralPercentage',
    available: 'available',
    inventoryQuantity: 'inventoryQuantity',
    images: 'images',
    weight: 'weight',
    requiresShipping: 'requiresShipping',
    taxable: 'taxable',
    shopifyVariantId: 'shopifyVariantId',
    position: 'position',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type ProductVariantScalarFieldEnum = (typeof ProductVariantScalarFieldEnum)[keyof typeof ProductVariantScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    enabled: 'enabled'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const ReferralLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeUsed: 'codeUsed',
    refererId: 'refererId',
    createdAt: 'createdAt'
  };

  export type ReferralLogScalarFieldEnum = (typeof ReferralLogScalarFieldEnum)[keyof typeof ReferralLogScalarFieldEnum]


  export const ReferralEarningsLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refererId: 'refererId',
    shopifyOrderId: 'shopifyOrderId',
    amount: 'amount',
    createdAt: 'createdAt'
  };

  export type ReferralEarningsLogScalarFieldEnum = (typeof ReferralEarningsLogScalarFieldEnum)[keyof typeof ReferralEarningsLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    referralCode?: StringFilter<"User"> | string
    referrerId?: IntNullableFilter<"User"> | number | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    enabled?: BoolFilter<"User"> | boolean
    totalReferralEarnings?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFilter<"User"> | number
    referrer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    referredUsers?: UserListRelationFilter
    referralLogsUsed?: ReferralLogListRelationFilter
    referralLogsReceived?: ReferralLogListRelationFilter
    referralEarningsGenerated?: ReferralEarningsLogListRelationFilter
    referralEarningsReceived?: ReferralEarningsLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    referralCode?: SortOrder
    referrerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
    referrer?: UserOrderByWithRelationInput
    referredUsers?: UserOrderByRelationAggregateInput
    referralLogsUsed?: ReferralLogOrderByRelationAggregateInput
    referralLogsReceived?: ReferralLogOrderByRelationAggregateInput
    referralEarningsGenerated?: ReferralEarningsLogOrderByRelationAggregateInput
    referralEarningsReceived?: ReferralEarningsLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    referralCode?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    referrerId?: IntNullableFilter<"User"> | number | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    enabled?: BoolFilter<"User"> | boolean
    totalReferralEarnings?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFilter<"User"> | number
    referrer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    referredUsers?: UserListRelationFilter
    referralLogsUsed?: ReferralLogListRelationFilter
    referralLogsReceived?: ReferralLogListRelationFilter
    referralEarningsGenerated?: ReferralEarningsLogListRelationFilter
    referralEarningsReceived?: ReferralEarningsLogListRelationFilter
  }, "id" | "email" | "referralCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    role?: SortOrder
    referralCode?: SortOrder
    referrerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    referralCode?: StringWithAggregatesFilter<"User"> | string
    referrerId?: IntNullableWithAggregatesFilter<"User"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    enabled?: BoolWithAggregatesFilter<"User"> | boolean
    totalReferralEarnings?: DecimalWithAggregatesFilter<"User"> | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalWithAggregatesFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntWithAggregatesFilter<"User"> | number
  }

  export type EmailOtpWhereInput = {
    AND?: EmailOtpWhereInput | EmailOtpWhereInput[]
    OR?: EmailOtpWhereInput[]
    NOT?: EmailOtpWhereInput | EmailOtpWhereInput[]
    id?: IntFilter<"EmailOtp"> | number
    email?: StringFilter<"EmailOtp"> | string
    otp?: StringFilter<"EmailOtp"> | string
    expiresAt?: DateTimeFilter<"EmailOtp"> | Date | string
    wrongAttempts?: IntFilter<"EmailOtp"> | number
    blockedUntil?: DateTimeNullableFilter<"EmailOtp"> | Date | string | null
    resendCount?: IntFilter<"EmailOtp"> | number
    createdAt?: DateTimeFilter<"EmailOtp"> | Date | string
    updatedAt?: DateTimeFilter<"EmailOtp"> | Date | string
    enabled?: BoolFilter<"EmailOtp"> | boolean
  }

  export type EmailOtpOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    otp?: SortOrder
    expiresAt?: SortOrder
    wrongAttempts?: SortOrder
    blockedUntil?: SortOrderInput | SortOrder
    resendCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type EmailOtpWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: EmailOtpWhereInput | EmailOtpWhereInput[]
    OR?: EmailOtpWhereInput[]
    NOT?: EmailOtpWhereInput | EmailOtpWhereInput[]
    otp?: StringFilter<"EmailOtp"> | string
    expiresAt?: DateTimeFilter<"EmailOtp"> | Date | string
    wrongAttempts?: IntFilter<"EmailOtp"> | number
    blockedUntil?: DateTimeNullableFilter<"EmailOtp"> | Date | string | null
    resendCount?: IntFilter<"EmailOtp"> | number
    createdAt?: DateTimeFilter<"EmailOtp"> | Date | string
    updatedAt?: DateTimeFilter<"EmailOtp"> | Date | string
    enabled?: BoolFilter<"EmailOtp"> | boolean
  }, "id" | "email">

  export type EmailOtpOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    otp?: SortOrder
    expiresAt?: SortOrder
    wrongAttempts?: SortOrder
    blockedUntil?: SortOrderInput | SortOrder
    resendCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: EmailOtpCountOrderByAggregateInput
    _avg?: EmailOtpAvgOrderByAggregateInput
    _max?: EmailOtpMaxOrderByAggregateInput
    _min?: EmailOtpMinOrderByAggregateInput
    _sum?: EmailOtpSumOrderByAggregateInput
  }

  export type EmailOtpScalarWhereWithAggregatesInput = {
    AND?: EmailOtpScalarWhereWithAggregatesInput | EmailOtpScalarWhereWithAggregatesInput[]
    OR?: EmailOtpScalarWhereWithAggregatesInput[]
    NOT?: EmailOtpScalarWhereWithAggregatesInput | EmailOtpScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EmailOtp"> | number
    email?: StringWithAggregatesFilter<"EmailOtp"> | string
    otp?: StringWithAggregatesFilter<"EmailOtp"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"EmailOtp"> | Date | string
    wrongAttempts?: IntWithAggregatesFilter<"EmailOtp"> | number
    blockedUntil?: DateTimeNullableWithAggregatesFilter<"EmailOtp"> | Date | string | null
    resendCount?: IntWithAggregatesFilter<"EmailOtp"> | number
    createdAt?: DateTimeWithAggregatesFilter<"EmailOtp"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EmailOtp"> | Date | string
    enabled?: BoolWithAggregatesFilter<"EmailOtp"> | boolean
  }

  export type VendorWhereInput = {
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    id?: IntFilter<"Vendor"> | number
    name?: StringFilter<"Vendor"> | string
    slug?: StringFilter<"Vendor"> | string
    description?: StringNullableFilter<"Vendor"> | string | null
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    enabled?: BoolFilter<"Vendor"> | boolean
    products?: ProductListRelationFilter
  }

  export type VendorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type VendorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: VendorWhereInput | VendorWhereInput[]
    OR?: VendorWhereInput[]
    NOT?: VendorWhereInput | VendorWhereInput[]
    description?: StringNullableFilter<"Vendor"> | string | null
    createdAt?: DateTimeFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeFilter<"Vendor"> | Date | string
    enabled?: BoolFilter<"Vendor"> | boolean
    products?: ProductListRelationFilter
  }, "id" | "name" | "slug">

  export type VendorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: VendorCountOrderByAggregateInput
    _avg?: VendorAvgOrderByAggregateInput
    _max?: VendorMaxOrderByAggregateInput
    _min?: VendorMinOrderByAggregateInput
    _sum?: VendorSumOrderByAggregateInput
  }

  export type VendorScalarWhereWithAggregatesInput = {
    AND?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    OR?: VendorScalarWhereWithAggregatesInput[]
    NOT?: VendorScalarWhereWithAggregatesInput | VendorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Vendor"> | number
    name?: StringWithAggregatesFilter<"Vendor"> | string
    slug?: StringWithAggregatesFilter<"Vendor"> | string
    description?: StringNullableWithAggregatesFilter<"Vendor"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vendor"> | Date | string
    enabled?: BoolWithAggregatesFilter<"Vendor"> | boolean
  }

  export type ProductTypeWhereInput = {
    AND?: ProductTypeWhereInput | ProductTypeWhereInput[]
    OR?: ProductTypeWhereInput[]
    NOT?: ProductTypeWhereInput | ProductTypeWhereInput[]
    id?: IntFilter<"ProductType"> | number
    name?: StringFilter<"ProductType"> | string
    slug?: StringFilter<"ProductType"> | string
    description?: StringNullableFilter<"ProductType"> | string | null
    createdAt?: DateTimeFilter<"ProductType"> | Date | string
    updatedAt?: DateTimeFilter<"ProductType"> | Date | string
    enabled?: BoolFilter<"ProductType"> | boolean
    products?: ProductListRelationFilter
  }

  export type ProductTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type ProductTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: ProductTypeWhereInput | ProductTypeWhereInput[]
    OR?: ProductTypeWhereInput[]
    NOT?: ProductTypeWhereInput | ProductTypeWhereInput[]
    description?: StringNullableFilter<"ProductType"> | string | null
    createdAt?: DateTimeFilter<"ProductType"> | Date | string
    updatedAt?: DateTimeFilter<"ProductType"> | Date | string
    enabled?: BoolFilter<"ProductType"> | boolean
    products?: ProductListRelationFilter
  }, "id" | "name" | "slug">

  export type ProductTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: ProductTypeCountOrderByAggregateInput
    _avg?: ProductTypeAvgOrderByAggregateInput
    _max?: ProductTypeMaxOrderByAggregateInput
    _min?: ProductTypeMinOrderByAggregateInput
    _sum?: ProductTypeSumOrderByAggregateInput
  }

  export type ProductTypeScalarWhereWithAggregatesInput = {
    AND?: ProductTypeScalarWhereWithAggregatesInput | ProductTypeScalarWhereWithAggregatesInput[]
    OR?: ProductTypeScalarWhereWithAggregatesInput[]
    NOT?: ProductTypeScalarWhereWithAggregatesInput | ProductTypeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProductType"> | number
    name?: StringWithAggregatesFilter<"ProductType"> | string
    slug?: StringWithAggregatesFilter<"ProductType"> | string
    description?: StringNullableWithAggregatesFilter<"ProductType"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProductType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductType"> | Date | string
    enabled?: BoolWithAggregatesFilter<"ProductType"> | boolean
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    description?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    enabled?: BoolFilter<"Category"> | boolean
    products?: ProductListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    description?: StringNullableFilter<"Category"> | string | null
    createdAt?: DateTimeFilter<"Category"> | Date | string
    updatedAt?: DateTimeFilter<"Category"> | Date | string
    enabled?: BoolFilter<"Category"> | boolean
    products?: ProductListRelationFilter
  }, "id" | "name" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    description?: StringNullableWithAggregatesFilter<"Category"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
    enabled?: BoolWithAggregatesFilter<"Category"> | boolean
  }

  export type ProductWhereInput = {
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    id?: IntFilter<"Product"> | number
    title?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    vendorId?: IntNullableFilter<"Product"> | number | null
    productTypeId?: IntNullableFilter<"Product"> | number | null
    published?: BoolFilter<"Product"> | boolean
    publishedAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    price?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    inventoryQuantity?: IntNullableFilter<"Product"> | number | null
    available?: BoolFilter<"Product"> | boolean
    referralPercentage?: FloatFilter<"Product"> | number
    shopifyProductId?: StringNullableFilter<"Product"> | string | null
    images?: StringNullableListFilter<"Product">
    categoryId?: IntNullableFilter<"Product"> | number | null
    tagId?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    enabled?: BoolFilter<"Product"> | boolean
    vendor?: XOR<VendorNullableScalarRelationFilter, VendorWhereInput> | null
    productType?: XOR<ProductTypeNullableScalarRelationFilter, ProductTypeWhereInput> | null
    variants?: ProductVariantListRelationFilter
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    tag?: XOR<TagNullableScalarRelationFilter, TagWhereInput> | null
  }

  export type ProductOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    productTypeId?: SortOrderInput | SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    inventoryQuantity?: SortOrderInput | SortOrder
    available?: SortOrder
    referralPercentage?: SortOrder
    shopifyProductId?: SortOrderInput | SortOrder
    images?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    tagId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    vendor?: VendorOrderByWithRelationInput
    productType?: ProductTypeOrderByWithRelationInput
    variants?: ProductVariantOrderByRelationAggregateInput
    category?: CategoryOrderByWithRelationInput
    tag?: TagOrderByWithRelationInput
  }

  export type ProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    shopifyProductId?: string
    AND?: ProductWhereInput | ProductWhereInput[]
    OR?: ProductWhereInput[]
    NOT?: ProductWhereInput | ProductWhereInput[]
    title?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    vendorId?: IntNullableFilter<"Product"> | number | null
    productTypeId?: IntNullableFilter<"Product"> | number | null
    published?: BoolFilter<"Product"> | boolean
    publishedAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    price?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    inventoryQuantity?: IntNullableFilter<"Product"> | number | null
    available?: BoolFilter<"Product"> | boolean
    referralPercentage?: FloatFilter<"Product"> | number
    images?: StringNullableListFilter<"Product">
    categoryId?: IntNullableFilter<"Product"> | number | null
    tagId?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    enabled?: BoolFilter<"Product"> | boolean
    vendor?: XOR<VendorNullableScalarRelationFilter, VendorWhereInput> | null
    productType?: XOR<ProductTypeNullableScalarRelationFilter, ProductTypeWhereInput> | null
    variants?: ProductVariantListRelationFilter
    category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    tag?: XOR<TagNullableScalarRelationFilter, TagWhereInput> | null
  }, "id" | "slug" | "shopifyProductId">

  export type ProductOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    vendorId?: SortOrderInput | SortOrder
    productTypeId?: SortOrderInput | SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    sku?: SortOrderInput | SortOrder
    inventoryQuantity?: SortOrderInput | SortOrder
    available?: SortOrder
    referralPercentage?: SortOrder
    shopifyProductId?: SortOrderInput | SortOrder
    images?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    tagId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: ProductCountOrderByAggregateInput
    _avg?: ProductAvgOrderByAggregateInput
    _max?: ProductMaxOrderByAggregateInput
    _min?: ProductMinOrderByAggregateInput
    _sum?: ProductSumOrderByAggregateInput
  }

  export type ProductScalarWhereWithAggregatesInput = {
    AND?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    OR?: ProductScalarWhereWithAggregatesInput[]
    NOT?: ProductScalarWhereWithAggregatesInput | ProductScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Product"> | number
    title?: StringWithAggregatesFilter<"Product"> | string
    slug?: StringWithAggregatesFilter<"Product"> | string
    description?: StringNullableWithAggregatesFilter<"Product"> | string | null
    vendorId?: IntNullableWithAggregatesFilter<"Product"> | number | null
    productTypeId?: IntNullableWithAggregatesFilter<"Product"> | number | null
    published?: BoolWithAggregatesFilter<"Product"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Product"> | Date | string | null
    price?: DecimalNullableWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableWithAggregatesFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    sku?: StringNullableWithAggregatesFilter<"Product"> | string | null
    inventoryQuantity?: IntNullableWithAggregatesFilter<"Product"> | number | null
    available?: BoolWithAggregatesFilter<"Product"> | boolean
    referralPercentage?: FloatWithAggregatesFilter<"Product"> | number
    shopifyProductId?: StringNullableWithAggregatesFilter<"Product"> | string | null
    images?: StringNullableListFilter<"Product">
    categoryId?: IntNullableWithAggregatesFilter<"Product"> | number | null
    tagId?: IntNullableWithAggregatesFilter<"Product"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Product"> | Date | string
    enabled?: BoolWithAggregatesFilter<"Product"> | boolean
  }

  export type ProductVariantWhereInput = {
    AND?: ProductVariantWhereInput | ProductVariantWhereInput[]
    OR?: ProductVariantWhereInput[]
    NOT?: ProductVariantWhereInput | ProductVariantWhereInput[]
    id?: IntFilter<"ProductVariant"> | number
    productId?: IntFilter<"ProductVariant"> | number
    parentVariantId?: IntNullableFilter<"ProductVariant"> | number | null
    shopifyProductId?: StringNullableFilter<"ProductVariant"> | string | null
    title?: StringFilter<"ProductVariant"> | string
    sku?: StringNullableFilter<"ProductVariant"> | string | null
    price?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFilter<"ProductVariant"> | number
    available?: BoolFilter<"ProductVariant"> | boolean
    inventoryQuantity?: IntFilter<"ProductVariant"> | number
    images?: StringNullableListFilter<"ProductVariant">
    weight?: IntNullableFilter<"ProductVariant"> | number | null
    requiresShipping?: BoolFilter<"ProductVariant"> | boolean
    taxable?: BoolFilter<"ProductVariant"> | boolean
    shopifyVariantId?: StringNullableFilter<"ProductVariant"> | string | null
    position?: IntFilter<"ProductVariant"> | number
    createdAt?: DateTimeFilter<"ProductVariant"> | Date | string
    updatedAt?: DateTimeFilter<"ProductVariant"> | Date | string
    enabled?: BoolFilter<"ProductVariant"> | boolean
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    parentVariant?: XOR<ProductVariantNullableScalarRelationFilter, ProductVariantWhereInput> | null
    childVariants?: ProductVariantListRelationFilter
  }

  export type ProductVariantOrderByWithRelationInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrderInput | SortOrder
    shopifyProductId?: SortOrderInput | SortOrder
    title?: SortOrder
    sku?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    referralPercentage?: SortOrder
    available?: SortOrder
    inventoryQuantity?: SortOrder
    images?: SortOrder
    weight?: SortOrderInput | SortOrder
    requiresShipping?: SortOrder
    taxable?: SortOrder
    shopifyVariantId?: SortOrderInput | SortOrder
    position?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    product?: ProductOrderByWithRelationInput
    parentVariant?: ProductVariantOrderByWithRelationInput
    childVariants?: ProductVariantOrderByRelationAggregateInput
  }

  export type ProductVariantWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    shopifyProductId?: string
    shopifyVariantId?: string
    AND?: ProductVariantWhereInput | ProductVariantWhereInput[]
    OR?: ProductVariantWhereInput[]
    NOT?: ProductVariantWhereInput | ProductVariantWhereInput[]
    productId?: IntFilter<"ProductVariant"> | number
    parentVariantId?: IntNullableFilter<"ProductVariant"> | number | null
    title?: StringFilter<"ProductVariant"> | string
    sku?: StringNullableFilter<"ProductVariant"> | string | null
    price?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFilter<"ProductVariant"> | number
    available?: BoolFilter<"ProductVariant"> | boolean
    inventoryQuantity?: IntFilter<"ProductVariant"> | number
    images?: StringNullableListFilter<"ProductVariant">
    weight?: IntNullableFilter<"ProductVariant"> | number | null
    requiresShipping?: BoolFilter<"ProductVariant"> | boolean
    taxable?: BoolFilter<"ProductVariant"> | boolean
    position?: IntFilter<"ProductVariant"> | number
    createdAt?: DateTimeFilter<"ProductVariant"> | Date | string
    updatedAt?: DateTimeFilter<"ProductVariant"> | Date | string
    enabled?: BoolFilter<"ProductVariant"> | boolean
    product?: XOR<ProductScalarRelationFilter, ProductWhereInput>
    parentVariant?: XOR<ProductVariantNullableScalarRelationFilter, ProductVariantWhereInput> | null
    childVariants?: ProductVariantListRelationFilter
  }, "id" | "shopifyProductId" | "shopifyVariantId">

  export type ProductVariantOrderByWithAggregationInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrderInput | SortOrder
    shopifyProductId?: SortOrderInput | SortOrder
    title?: SortOrder
    sku?: SortOrderInput | SortOrder
    price?: SortOrderInput | SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    referralPercentage?: SortOrder
    available?: SortOrder
    inventoryQuantity?: SortOrder
    images?: SortOrder
    weight?: SortOrderInput | SortOrder
    requiresShipping?: SortOrder
    taxable?: SortOrder
    shopifyVariantId?: SortOrderInput | SortOrder
    position?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: ProductVariantCountOrderByAggregateInput
    _avg?: ProductVariantAvgOrderByAggregateInput
    _max?: ProductVariantMaxOrderByAggregateInput
    _min?: ProductVariantMinOrderByAggregateInput
    _sum?: ProductVariantSumOrderByAggregateInput
  }

  export type ProductVariantScalarWhereWithAggregatesInput = {
    AND?: ProductVariantScalarWhereWithAggregatesInput | ProductVariantScalarWhereWithAggregatesInput[]
    OR?: ProductVariantScalarWhereWithAggregatesInput[]
    NOT?: ProductVariantScalarWhereWithAggregatesInput | ProductVariantScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ProductVariant"> | number
    productId?: IntWithAggregatesFilter<"ProductVariant"> | number
    parentVariantId?: IntNullableWithAggregatesFilter<"ProductVariant"> | number | null
    shopifyProductId?: StringNullableWithAggregatesFilter<"ProductVariant"> | string | null
    title?: StringWithAggregatesFilter<"ProductVariant"> | string
    sku?: StringNullableWithAggregatesFilter<"ProductVariant"> | string | null
    price?: DecimalNullableWithAggregatesFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableWithAggregatesFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatWithAggregatesFilter<"ProductVariant"> | number
    available?: BoolWithAggregatesFilter<"ProductVariant"> | boolean
    inventoryQuantity?: IntWithAggregatesFilter<"ProductVariant"> | number
    images?: StringNullableListFilter<"ProductVariant">
    weight?: IntNullableWithAggregatesFilter<"ProductVariant"> | number | null
    requiresShipping?: BoolWithAggregatesFilter<"ProductVariant"> | boolean
    taxable?: BoolWithAggregatesFilter<"ProductVariant"> | boolean
    shopifyVariantId?: StringNullableWithAggregatesFilter<"ProductVariant"> | string | null
    position?: IntWithAggregatesFilter<"ProductVariant"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ProductVariant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProductVariant"> | Date | string
    enabled?: BoolWithAggregatesFilter<"ProductVariant"> | boolean
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: IntFilter<"Tag"> | number
    name?: StringFilter<"Tag"> | string
    slug?: StringFilter<"Tag"> | string
    description?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    enabled?: BoolFilter<"Tag"> | boolean
    products?: ProductListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    products?: ProductOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    description?: StringNullableFilter<"Tag"> | string | null
    createdAt?: DateTimeFilter<"Tag"> | Date | string
    updatedAt?: DateTimeFilter<"Tag"> | Date | string
    enabled?: BoolFilter<"Tag"> | boolean
    products?: ProductListRelationFilter
  }, "id" | "name" | "slug">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _avg?: TagAvgOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
    _sum?: TagSumOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tag"> | number
    name?: StringWithAggregatesFilter<"Tag"> | string
    slug?: StringWithAggregatesFilter<"Tag"> | string
    description?: StringNullableWithAggregatesFilter<"Tag"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
    enabled?: BoolWithAggregatesFilter<"Tag"> | boolean
  }

  export type ReferralLogWhereInput = {
    AND?: ReferralLogWhereInput | ReferralLogWhereInput[]
    OR?: ReferralLogWhereInput[]
    NOT?: ReferralLogWhereInput | ReferralLogWhereInput[]
    id?: IntFilter<"ReferralLog"> | number
    userId?: IntFilter<"ReferralLog"> | number
    codeUsed?: StringFilter<"ReferralLog"> | string
    refererId?: IntFilter<"ReferralLog"> | number
    createdAt?: DateTimeFilter<"ReferralLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    referer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ReferralLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeUsed?: SortOrder
    refererId?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    referer?: UserOrderByWithRelationInput
  }

  export type ReferralLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ReferralLogWhereInput | ReferralLogWhereInput[]
    OR?: ReferralLogWhereInput[]
    NOT?: ReferralLogWhereInput | ReferralLogWhereInput[]
    userId?: IntFilter<"ReferralLog"> | number
    codeUsed?: StringFilter<"ReferralLog"> | string
    refererId?: IntFilter<"ReferralLog"> | number
    createdAt?: DateTimeFilter<"ReferralLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    referer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ReferralLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeUsed?: SortOrder
    refererId?: SortOrder
    createdAt?: SortOrder
    _count?: ReferralLogCountOrderByAggregateInput
    _avg?: ReferralLogAvgOrderByAggregateInput
    _max?: ReferralLogMaxOrderByAggregateInput
    _min?: ReferralLogMinOrderByAggregateInput
    _sum?: ReferralLogSumOrderByAggregateInput
  }

  export type ReferralLogScalarWhereWithAggregatesInput = {
    AND?: ReferralLogScalarWhereWithAggregatesInput | ReferralLogScalarWhereWithAggregatesInput[]
    OR?: ReferralLogScalarWhereWithAggregatesInput[]
    NOT?: ReferralLogScalarWhereWithAggregatesInput | ReferralLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReferralLog"> | number
    userId?: IntWithAggregatesFilter<"ReferralLog"> | number
    codeUsed?: StringWithAggregatesFilter<"ReferralLog"> | string
    refererId?: IntWithAggregatesFilter<"ReferralLog"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ReferralLog"> | Date | string
  }

  export type ReferralEarningsLogWhereInput = {
    AND?: ReferralEarningsLogWhereInput | ReferralEarningsLogWhereInput[]
    OR?: ReferralEarningsLogWhereInput[]
    NOT?: ReferralEarningsLogWhereInput | ReferralEarningsLogWhereInput[]
    id?: IntFilter<"ReferralEarningsLog"> | number
    userId?: IntFilter<"ReferralEarningsLog"> | number
    refererId?: IntFilter<"ReferralEarningsLog"> | number
    shopifyOrderId?: StringNullableFilter<"ReferralEarningsLog"> | string | null
    amount?: DecimalFilter<"ReferralEarningsLog"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReferralEarningsLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    referer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ReferralEarningsLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    shopifyOrderId?: SortOrderInput | SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    referer?: UserOrderByWithRelationInput
  }

  export type ReferralEarningsLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ReferralEarningsLogWhereInput | ReferralEarningsLogWhereInput[]
    OR?: ReferralEarningsLogWhereInput[]
    NOT?: ReferralEarningsLogWhereInput | ReferralEarningsLogWhereInput[]
    userId?: IntFilter<"ReferralEarningsLog"> | number
    refererId?: IntFilter<"ReferralEarningsLog"> | number
    shopifyOrderId?: StringNullableFilter<"ReferralEarningsLog"> | string | null
    amount?: DecimalFilter<"ReferralEarningsLog"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReferralEarningsLog"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    referer?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ReferralEarningsLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    shopifyOrderId?: SortOrderInput | SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
    _count?: ReferralEarningsLogCountOrderByAggregateInput
    _avg?: ReferralEarningsLogAvgOrderByAggregateInput
    _max?: ReferralEarningsLogMaxOrderByAggregateInput
    _min?: ReferralEarningsLogMinOrderByAggregateInput
    _sum?: ReferralEarningsLogSumOrderByAggregateInput
  }

  export type ReferralEarningsLogScalarWhereWithAggregatesInput = {
    AND?: ReferralEarningsLogScalarWhereWithAggregatesInput | ReferralEarningsLogScalarWhereWithAggregatesInput[]
    OR?: ReferralEarningsLogScalarWhereWithAggregatesInput[]
    NOT?: ReferralEarningsLogScalarWhereWithAggregatesInput | ReferralEarningsLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ReferralEarningsLog"> | number
    userId?: IntWithAggregatesFilter<"ReferralEarningsLog"> | number
    refererId?: IntWithAggregatesFilter<"ReferralEarningsLog"> | number
    shopifyOrderId?: StringNullableWithAggregatesFilter<"ReferralEarningsLog"> | string | null
    amount?: DecimalWithAggregatesFilter<"ReferralEarningsLog"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"ReferralEarningsLog"> | Date | string
  }

  export type UserCreateInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
  }

  export type UserUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
  }

  export type EmailOtpCreateInput = {
    email: string
    otp: string
    expiresAt: Date | string
    wrongAttempts?: number
    blockedUntil?: Date | string | null
    resendCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type EmailOtpUncheckedCreateInput = {
    id?: number
    email: string
    otp: string
    expiresAt: Date | string
    wrongAttempts?: number
    blockedUntil?: Date | string | null
    resendCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type EmailOtpUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    otp?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wrongAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resendCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmailOtpUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    otp?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wrongAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resendCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmailOtpCreateManyInput = {
    id?: number
    email: string
    otp: string
    expiresAt: Date | string
    wrongAttempts?: number
    blockedUntil?: Date | string | null
    resendCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type EmailOtpUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    otp?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wrongAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resendCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type EmailOtpUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    otp?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wrongAttempts?: IntFieldUpdateOperationsInput | number
    blockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resendCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorCreateInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductCreateNestedManyWithoutVendorInput
  }

  export type VendorUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutVendorInput
  }

  export type VendorUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutVendorNestedInput
  }

  export type VendorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutVendorNestedInput
  }

  export type VendorCreateManyInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type VendorUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductTypeCreateInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductCreateNestedManyWithoutProductTypeInput
  }

  export type ProductTypeUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutProductTypeInput
  }

  export type ProductTypeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutProductTypeNestedInput
  }

  export type ProductTypeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutProductTypeNestedInput
  }

  export type ProductTypeCreateManyInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductTypeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductTypeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CategoryCreateInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    vendor?: VendorCreateNestedOneWithoutProductsInput
    productType?: ProductTypeCreateNestedOneWithoutProductsInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    category?: CategoryCreateNestedOneWithoutProductsInput
    tag?: TagCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    vendor?: VendorUpdateOneWithoutProductsNestedInput
    productType?: ProductTypeUpdateOneWithoutProductsNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    category?: CategoryUpdateOneWithoutProductsNestedInput
    tag?: TagUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductCreateManyInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantCreateInput = {
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    product: ProductCreateNestedOneWithoutVariantsInput
    parentVariant?: ProductVariantCreateNestedOneWithoutChildVariantsInput
    childVariants?: ProductVariantCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantUncheckedCreateInput = {
    id?: number
    productId: number
    parentVariantId?: number | null
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    childVariants?: ProductVariantUncheckedCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantUpdateInput = {
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    product?: ProductUpdateOneRequiredWithoutVariantsNestedInput
    parentVariant?: ProductVariantUpdateOneWithoutChildVariantsNestedInput
    childVariants?: ProductVariantUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    parentVariantId?: NullableIntFieldUpdateOperationsInput | number | null
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    childVariants?: ProductVariantUncheckedUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantCreateManyInput = {
    id?: number
    productId: number
    parentVariantId?: number | null
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductVariantUpdateManyMutationInput = {
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    parentVariantId?: NullableIntFieldUpdateOperationsInput | number | null
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TagCreateInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    products?: ProductUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    products?: ProductUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type TagUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TagUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ReferralLogCreateInput = {
    codeUsed: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutReferralLogsUsedInput
    referer: UserCreateNestedOneWithoutReferralLogsReceivedInput
  }

  export type ReferralLogUncheckedCreateInput = {
    id?: number
    userId: number
    codeUsed: string
    refererId: number
    createdAt?: Date | string
  }

  export type ReferralLogUpdateInput = {
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReferralLogsUsedNestedInput
    referer?: UserUpdateOneRequiredWithoutReferralLogsReceivedNestedInput
  }

  export type ReferralLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    refererId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralLogCreateManyInput = {
    id?: number
    userId: number
    codeUsed: string
    refererId: number
    createdAt?: Date | string
  }

  export type ReferralLogUpdateManyMutationInput = {
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    refererId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogCreateInput = {
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutReferralEarningsGeneratedInput
    referer: UserCreateNestedOneWithoutReferralEarningsReceivedInput
  }

  export type ReferralEarningsLogUncheckedCreateInput = {
    id?: number
    userId: number
    refererId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogUpdateInput = {
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReferralEarningsGeneratedNestedInput
    referer?: UserUpdateOneRequiredWithoutReferralEarningsReceivedNestedInput
  }

  export type ReferralEarningsLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    refererId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogCreateManyInput = {
    id?: number
    userId: number
    refererId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogUpdateManyMutationInput = {
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    refererId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type ReferralLogListRelationFilter = {
    every?: ReferralLogWhereInput
    some?: ReferralLogWhereInput
    none?: ReferralLogWhereInput
  }

  export type ReferralEarningsLogListRelationFilter = {
    every?: ReferralEarningsLogWhereInput
    some?: ReferralEarningsLogWhereInput
    none?: ReferralEarningsLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReferralLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReferralEarningsLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    referralCode?: SortOrder
    referrerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    referrerId?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    referralCode?: SortOrder
    referrerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
    referralCode?: SortOrder
    referrerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    referrerId?: SortOrder
    totalReferralEarnings?: SortOrder
    withdrawableBalance?: SortOrder
    totalReferredUsers?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EmailOtpCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    otp?: SortOrder
    expiresAt?: SortOrder
    wrongAttempts?: SortOrder
    blockedUntil?: SortOrder
    resendCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type EmailOtpAvgOrderByAggregateInput = {
    id?: SortOrder
    wrongAttempts?: SortOrder
    resendCount?: SortOrder
  }

  export type EmailOtpMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    otp?: SortOrder
    expiresAt?: SortOrder
    wrongAttempts?: SortOrder
    blockedUntil?: SortOrder
    resendCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type EmailOtpMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    otp?: SortOrder
    expiresAt?: SortOrder
    wrongAttempts?: SortOrder
    blockedUntil?: SortOrder
    resendCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type EmailOtpSumOrderByAggregateInput = {
    id?: SortOrder
    wrongAttempts?: SortOrder
    resendCount?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProductListRelationFilter = {
    every?: ProductWhereInput
    some?: ProductWhereInput
    none?: ProductWhereInput
  }

  export type ProductOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VendorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type VendorAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type VendorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type VendorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type VendorSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProductTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductTypeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ProductTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductTypeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type VendorNullableScalarRelationFilter = {
    is?: VendorWhereInput | null
    isNot?: VendorWhereInput | null
  }

  export type ProductTypeNullableScalarRelationFilter = {
    is?: ProductTypeWhereInput | null
    isNot?: ProductTypeWhereInput | null
  }

  export type ProductVariantListRelationFilter = {
    every?: ProductVariantWhereInput
    some?: ProductVariantWhereInput
    none?: ProductVariantWhereInput
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type TagNullableScalarRelationFilter = {
    is?: TagWhereInput | null
    isNot?: TagWhereInput | null
  }

  export type ProductVariantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProductCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    vendorId?: SortOrder
    productTypeId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    sku?: SortOrder
    inventoryQuantity?: SortOrder
    available?: SortOrder
    referralPercentage?: SortOrder
    shopifyProductId?: SortOrder
    images?: SortOrder
    categoryId?: SortOrder
    tagId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductAvgOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    productTypeId?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    inventoryQuantity?: SortOrder
    referralPercentage?: SortOrder
    categoryId?: SortOrder
    tagId?: SortOrder
  }

  export type ProductMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    vendorId?: SortOrder
    productTypeId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    sku?: SortOrder
    inventoryQuantity?: SortOrder
    available?: SortOrder
    referralPercentage?: SortOrder
    shopifyProductId?: SortOrder
    categoryId?: SortOrder
    tagId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    vendorId?: SortOrder
    productTypeId?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    sku?: SortOrder
    inventoryQuantity?: SortOrder
    available?: SortOrder
    referralPercentage?: SortOrder
    shopifyProductId?: SortOrder
    categoryId?: SortOrder
    tagId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductSumOrderByAggregateInput = {
    id?: SortOrder
    vendorId?: SortOrder
    productTypeId?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    inventoryQuantity?: SortOrder
    referralPercentage?: SortOrder
    categoryId?: SortOrder
    tagId?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ProductScalarRelationFilter = {
    is?: ProductWhereInput
    isNot?: ProductWhereInput
  }

  export type ProductVariantNullableScalarRelationFilter = {
    is?: ProductVariantWhereInput | null
    isNot?: ProductVariantWhereInput | null
  }

  export type ProductVariantCountOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrder
    shopifyProductId?: SortOrder
    title?: SortOrder
    sku?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    referralPercentage?: SortOrder
    available?: SortOrder
    inventoryQuantity?: SortOrder
    images?: SortOrder
    weight?: SortOrder
    requiresShipping?: SortOrder
    taxable?: SortOrder
    shopifyVariantId?: SortOrder
    position?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductVariantAvgOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    referralPercentage?: SortOrder
    inventoryQuantity?: SortOrder
    weight?: SortOrder
    position?: SortOrder
  }

  export type ProductVariantMaxOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrder
    shopifyProductId?: SortOrder
    title?: SortOrder
    sku?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    referralPercentage?: SortOrder
    available?: SortOrder
    inventoryQuantity?: SortOrder
    weight?: SortOrder
    requiresShipping?: SortOrder
    taxable?: SortOrder
    shopifyVariantId?: SortOrder
    position?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductVariantMinOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrder
    shopifyProductId?: SortOrder
    title?: SortOrder
    sku?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    referralPercentage?: SortOrder
    available?: SortOrder
    inventoryQuantity?: SortOrder
    weight?: SortOrder
    requiresShipping?: SortOrder
    taxable?: SortOrder
    shopifyVariantId?: SortOrder
    position?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type ProductVariantSumOrderByAggregateInput = {
    id?: SortOrder
    productId?: SortOrder
    parentVariantId?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    referralPercentage?: SortOrder
    inventoryQuantity?: SortOrder
    weight?: SortOrder
    position?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type TagAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    enabled?: SortOrder
  }

  export type TagSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ReferralLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeUsed?: SortOrder
    refererId?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralLogAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
  }

  export type ReferralLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeUsed?: SortOrder
    refererId?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeUsed?: SortOrder
    refererId?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralLogSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
  }

  export type ReferralEarningsLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    shopifyOrderId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralEarningsLogAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    amount?: SortOrder
  }

  export type ReferralEarningsLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    shopifyOrderId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralEarningsLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    shopifyOrderId?: SortOrder
    amount?: SortOrder
    createdAt?: SortOrder
  }

  export type ReferralEarningsLogSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refererId?: SortOrder
    amount?: SortOrder
  }

  export type UserCreateNestedOneWithoutReferredUsersInput = {
    create?: XOR<UserCreateWithoutReferredUsersInput, UserUncheckedCreateWithoutReferredUsersInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferredUsersInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutReferrerInput = {
    create?: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput> | UserCreateWithoutReferrerInput[] | UserUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutReferrerInput | UserCreateOrConnectWithoutReferrerInput[]
    createMany?: UserCreateManyReferrerInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ReferralLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput> | ReferralLogCreateWithoutUserInput[] | ReferralLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutUserInput | ReferralLogCreateOrConnectWithoutUserInput[]
    createMany?: ReferralLogCreateManyUserInputEnvelope
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
  }

  export type ReferralLogCreateNestedManyWithoutRefererInput = {
    create?: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput> | ReferralLogCreateWithoutRefererInput[] | ReferralLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutRefererInput | ReferralLogCreateOrConnectWithoutRefererInput[]
    createMany?: ReferralLogCreateManyRefererInputEnvelope
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
  }

  export type ReferralEarningsLogCreateNestedManyWithoutUserInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput> | ReferralEarningsLogCreateWithoutUserInput[] | ReferralEarningsLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutUserInput | ReferralEarningsLogCreateOrConnectWithoutUserInput[]
    createMany?: ReferralEarningsLogCreateManyUserInputEnvelope
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
  }

  export type ReferralEarningsLogCreateNestedManyWithoutRefererInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput> | ReferralEarningsLogCreateWithoutRefererInput[] | ReferralEarningsLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutRefererInput | ReferralEarningsLogCreateOrConnectWithoutRefererInput[]
    createMany?: ReferralEarningsLogCreateManyRefererInputEnvelope
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutReferrerInput = {
    create?: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput> | UserCreateWithoutReferrerInput[] | UserUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutReferrerInput | UserCreateOrConnectWithoutReferrerInput[]
    createMany?: UserCreateManyReferrerInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ReferralLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput> | ReferralLogCreateWithoutUserInput[] | ReferralLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutUserInput | ReferralLogCreateOrConnectWithoutUserInput[]
    createMany?: ReferralLogCreateManyUserInputEnvelope
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
  }

  export type ReferralLogUncheckedCreateNestedManyWithoutRefererInput = {
    create?: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput> | ReferralLogCreateWithoutRefererInput[] | ReferralLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutRefererInput | ReferralLogCreateOrConnectWithoutRefererInput[]
    createMany?: ReferralLogCreateManyRefererInputEnvelope
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
  }

  export type ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput> | ReferralEarningsLogCreateWithoutUserInput[] | ReferralEarningsLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutUserInput | ReferralEarningsLogCreateOrConnectWithoutUserInput[]
    createMany?: ReferralEarningsLogCreateManyUserInputEnvelope
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
  }

  export type ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput> | ReferralEarningsLogCreateWithoutRefererInput[] | ReferralEarningsLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutRefererInput | ReferralEarningsLogCreateOrConnectWithoutRefererInput[]
    createMany?: ReferralEarningsLogCreateManyRefererInputEnvelope
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneWithoutReferredUsersNestedInput = {
    create?: XOR<UserCreateWithoutReferredUsersInput, UserUncheckedCreateWithoutReferredUsersInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferredUsersInput
    upsert?: UserUpsertWithoutReferredUsersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReferredUsersInput, UserUpdateWithoutReferredUsersInput>, UserUncheckedUpdateWithoutReferredUsersInput>
  }

  export type UserUpdateManyWithoutReferrerNestedInput = {
    create?: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput> | UserCreateWithoutReferrerInput[] | UserUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutReferrerInput | UserCreateOrConnectWithoutReferrerInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutReferrerInput | UserUpsertWithWhereUniqueWithoutReferrerInput[]
    createMany?: UserCreateManyReferrerInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutReferrerInput | UserUpdateWithWhereUniqueWithoutReferrerInput[]
    updateMany?: UserUpdateManyWithWhereWithoutReferrerInput | UserUpdateManyWithWhereWithoutReferrerInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ReferralLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput> | ReferralLogCreateWithoutUserInput[] | ReferralLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutUserInput | ReferralLogCreateOrConnectWithoutUserInput[]
    upsert?: ReferralLogUpsertWithWhereUniqueWithoutUserInput | ReferralLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReferralLogCreateManyUserInputEnvelope
    set?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    disconnect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    delete?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    update?: ReferralLogUpdateWithWhereUniqueWithoutUserInput | ReferralLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReferralLogUpdateManyWithWhereWithoutUserInput | ReferralLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
  }

  export type ReferralLogUpdateManyWithoutRefererNestedInput = {
    create?: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput> | ReferralLogCreateWithoutRefererInput[] | ReferralLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutRefererInput | ReferralLogCreateOrConnectWithoutRefererInput[]
    upsert?: ReferralLogUpsertWithWhereUniqueWithoutRefererInput | ReferralLogUpsertWithWhereUniqueWithoutRefererInput[]
    createMany?: ReferralLogCreateManyRefererInputEnvelope
    set?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    disconnect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    delete?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    update?: ReferralLogUpdateWithWhereUniqueWithoutRefererInput | ReferralLogUpdateWithWhereUniqueWithoutRefererInput[]
    updateMany?: ReferralLogUpdateManyWithWhereWithoutRefererInput | ReferralLogUpdateManyWithWhereWithoutRefererInput[]
    deleteMany?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
  }

  export type ReferralEarningsLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput> | ReferralEarningsLogCreateWithoutUserInput[] | ReferralEarningsLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutUserInput | ReferralEarningsLogCreateOrConnectWithoutUserInput[]
    upsert?: ReferralEarningsLogUpsertWithWhereUniqueWithoutUserInput | ReferralEarningsLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReferralEarningsLogCreateManyUserInputEnvelope
    set?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    disconnect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    delete?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    update?: ReferralEarningsLogUpdateWithWhereUniqueWithoutUserInput | ReferralEarningsLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReferralEarningsLogUpdateManyWithWhereWithoutUserInput | ReferralEarningsLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
  }

  export type ReferralEarningsLogUpdateManyWithoutRefererNestedInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput> | ReferralEarningsLogCreateWithoutRefererInput[] | ReferralEarningsLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutRefererInput | ReferralEarningsLogCreateOrConnectWithoutRefererInput[]
    upsert?: ReferralEarningsLogUpsertWithWhereUniqueWithoutRefererInput | ReferralEarningsLogUpsertWithWhereUniqueWithoutRefererInput[]
    createMany?: ReferralEarningsLogCreateManyRefererInputEnvelope
    set?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    disconnect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    delete?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    update?: ReferralEarningsLogUpdateWithWhereUniqueWithoutRefererInput | ReferralEarningsLogUpdateWithWhereUniqueWithoutRefererInput[]
    updateMany?: ReferralEarningsLogUpdateManyWithWhereWithoutRefererInput | ReferralEarningsLogUpdateManyWithWhereWithoutRefererInput[]
    deleteMany?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUncheckedUpdateManyWithoutReferrerNestedInput = {
    create?: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput> | UserCreateWithoutReferrerInput[] | UserUncheckedCreateWithoutReferrerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutReferrerInput | UserCreateOrConnectWithoutReferrerInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutReferrerInput | UserUpsertWithWhereUniqueWithoutReferrerInput[]
    createMany?: UserCreateManyReferrerInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutReferrerInput | UserUpdateWithWhereUniqueWithoutReferrerInput[]
    updateMany?: UserUpdateManyWithWhereWithoutReferrerInput | UserUpdateManyWithWhereWithoutReferrerInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ReferralLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput> | ReferralLogCreateWithoutUserInput[] | ReferralLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutUserInput | ReferralLogCreateOrConnectWithoutUserInput[]
    upsert?: ReferralLogUpsertWithWhereUniqueWithoutUserInput | ReferralLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReferralLogCreateManyUserInputEnvelope
    set?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    disconnect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    delete?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    update?: ReferralLogUpdateWithWhereUniqueWithoutUserInput | ReferralLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReferralLogUpdateManyWithWhereWithoutUserInput | ReferralLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
  }

  export type ReferralLogUncheckedUpdateManyWithoutRefererNestedInput = {
    create?: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput> | ReferralLogCreateWithoutRefererInput[] | ReferralLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralLogCreateOrConnectWithoutRefererInput | ReferralLogCreateOrConnectWithoutRefererInput[]
    upsert?: ReferralLogUpsertWithWhereUniqueWithoutRefererInput | ReferralLogUpsertWithWhereUniqueWithoutRefererInput[]
    createMany?: ReferralLogCreateManyRefererInputEnvelope
    set?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    disconnect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    delete?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    connect?: ReferralLogWhereUniqueInput | ReferralLogWhereUniqueInput[]
    update?: ReferralLogUpdateWithWhereUniqueWithoutRefererInput | ReferralLogUpdateWithWhereUniqueWithoutRefererInput[]
    updateMany?: ReferralLogUpdateManyWithWhereWithoutRefererInput | ReferralLogUpdateManyWithWhereWithoutRefererInput[]
    deleteMany?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
  }

  export type ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput> | ReferralEarningsLogCreateWithoutUserInput[] | ReferralEarningsLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutUserInput | ReferralEarningsLogCreateOrConnectWithoutUserInput[]
    upsert?: ReferralEarningsLogUpsertWithWhereUniqueWithoutUserInput | ReferralEarningsLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ReferralEarningsLogCreateManyUserInputEnvelope
    set?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    disconnect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    delete?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    update?: ReferralEarningsLogUpdateWithWhereUniqueWithoutUserInput | ReferralEarningsLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ReferralEarningsLogUpdateManyWithWhereWithoutUserInput | ReferralEarningsLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
  }

  export type ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput = {
    create?: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput> | ReferralEarningsLogCreateWithoutRefererInput[] | ReferralEarningsLogUncheckedCreateWithoutRefererInput[]
    connectOrCreate?: ReferralEarningsLogCreateOrConnectWithoutRefererInput | ReferralEarningsLogCreateOrConnectWithoutRefererInput[]
    upsert?: ReferralEarningsLogUpsertWithWhereUniqueWithoutRefererInput | ReferralEarningsLogUpsertWithWhereUniqueWithoutRefererInput[]
    createMany?: ReferralEarningsLogCreateManyRefererInputEnvelope
    set?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    disconnect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    delete?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    connect?: ReferralEarningsLogWhereUniqueInput | ReferralEarningsLogWhereUniqueInput[]
    update?: ReferralEarningsLogUpdateWithWhereUniqueWithoutRefererInput | ReferralEarningsLogUpdateWithWhereUniqueWithoutRefererInput[]
    updateMany?: ReferralEarningsLogUpdateManyWithWhereWithoutRefererInput | ReferralEarningsLogUpdateManyWithWhereWithoutRefererInput[]
    deleteMany?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProductCreateNestedManyWithoutVendorInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutVendorInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutVendorNestedInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutVendorInput | ProductUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutVendorInput | ProductUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutVendorInput | ProductUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutVendorNestedInput = {
    create?: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput> | ProductCreateWithoutVendorInput[] | ProductUncheckedCreateWithoutVendorInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutVendorInput | ProductCreateOrConnectWithoutVendorInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutVendorInput | ProductUpsertWithWhereUniqueWithoutVendorInput[]
    createMany?: ProductCreateManyVendorInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutVendorInput | ProductUpdateWithWhereUniqueWithoutVendorInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutVendorInput | ProductUpdateManyWithWhereWithoutVendorInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductCreateNestedManyWithoutProductTypeInput = {
    create?: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput> | ProductCreateWithoutProductTypeInput[] | ProductUncheckedCreateWithoutProductTypeInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutProductTypeInput | ProductCreateOrConnectWithoutProductTypeInput[]
    createMany?: ProductCreateManyProductTypeInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutProductTypeInput = {
    create?: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput> | ProductCreateWithoutProductTypeInput[] | ProductUncheckedCreateWithoutProductTypeInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutProductTypeInput | ProductCreateOrConnectWithoutProductTypeInput[]
    createMany?: ProductCreateManyProductTypeInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutProductTypeNestedInput = {
    create?: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput> | ProductCreateWithoutProductTypeInput[] | ProductUncheckedCreateWithoutProductTypeInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutProductTypeInput | ProductCreateOrConnectWithoutProductTypeInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutProductTypeInput | ProductUpsertWithWhereUniqueWithoutProductTypeInput[]
    createMany?: ProductCreateManyProductTypeInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutProductTypeInput | ProductUpdateWithWhereUniqueWithoutProductTypeInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutProductTypeInput | ProductUpdateManyWithWhereWithoutProductTypeInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutProductTypeNestedInput = {
    create?: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput> | ProductCreateWithoutProductTypeInput[] | ProductUncheckedCreateWithoutProductTypeInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutProductTypeInput | ProductCreateOrConnectWithoutProductTypeInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutProductTypeInput | ProductUpsertWithWhereUniqueWithoutProductTypeInput[]
    createMany?: ProductCreateManyProductTypeInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutProductTypeInput | ProductUpdateWithWhereUniqueWithoutProductTypeInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutProductTypeInput | ProductUpdateManyWithWhereWithoutProductTypeInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput> | ProductCreateWithoutCategoryInput[] | ProductUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutCategoryInput | ProductCreateOrConnectWithoutCategoryInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutCategoryInput | ProductUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ProductCreateManyCategoryInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutCategoryInput | ProductUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutCategoryInput | ProductUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductCreateimagesInput = {
    set: string[]
  }

  export type VendorCreateNestedOneWithoutProductsInput = {
    create?: XOR<VendorCreateWithoutProductsInput, VendorUncheckedCreateWithoutProductsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutProductsInput
    connect?: VendorWhereUniqueInput
  }

  export type ProductTypeCreateNestedOneWithoutProductsInput = {
    create?: XOR<ProductTypeCreateWithoutProductsInput, ProductTypeUncheckedCreateWithoutProductsInput>
    connectOrCreate?: ProductTypeCreateOrConnectWithoutProductsInput
    connect?: ProductTypeWhereUniqueInput
  }

  export type ProductVariantCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type CategoryCreateNestedOneWithoutProductsInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    connect?: CategoryWhereUniqueInput
  }

  export type TagCreateNestedOneWithoutProductsInput = {
    create?: XOR<TagCreateWithoutProductsInput, TagUncheckedCreateWithoutProductsInput>
    connectOrCreate?: TagCreateOrConnectWithoutProductsInput
    connect?: TagWhereUniqueInput
  }

  export type ProductVariantUncheckedCreateNestedManyWithoutProductInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProductUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type VendorUpdateOneWithoutProductsNestedInput = {
    create?: XOR<VendorCreateWithoutProductsInput, VendorUncheckedCreateWithoutProductsInput>
    connectOrCreate?: VendorCreateOrConnectWithoutProductsInput
    upsert?: VendorUpsertWithoutProductsInput
    disconnect?: VendorWhereInput | boolean
    delete?: VendorWhereInput | boolean
    connect?: VendorWhereUniqueInput
    update?: XOR<XOR<VendorUpdateToOneWithWhereWithoutProductsInput, VendorUpdateWithoutProductsInput>, VendorUncheckedUpdateWithoutProductsInput>
  }

  export type ProductTypeUpdateOneWithoutProductsNestedInput = {
    create?: XOR<ProductTypeCreateWithoutProductsInput, ProductTypeUncheckedCreateWithoutProductsInput>
    connectOrCreate?: ProductTypeCreateOrConnectWithoutProductsInput
    upsert?: ProductTypeUpsertWithoutProductsInput
    disconnect?: ProductTypeWhereInput | boolean
    delete?: ProductTypeWhereInput | boolean
    connect?: ProductTypeWhereUniqueInput
    update?: XOR<XOR<ProductTypeUpdateToOneWithWhereWithoutProductsInput, ProductTypeUpdateWithoutProductsInput>, ProductTypeUncheckedUpdateWithoutProductsInput>
  }

  export type ProductVariantUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutProductInput | ProductVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutProductInput | ProductVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutProductInput | ProductVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type CategoryUpdateOneWithoutProductsNestedInput = {
    create?: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutProductsInput
    upsert?: CategoryUpsertWithoutProductsInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutProductsInput, CategoryUpdateWithoutProductsInput>, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type TagUpdateOneWithoutProductsNestedInput = {
    create?: XOR<TagCreateWithoutProductsInput, TagUncheckedCreateWithoutProductsInput>
    connectOrCreate?: TagCreateOrConnectWithoutProductsInput
    upsert?: TagUpsertWithoutProductsInput
    disconnect?: TagWhereInput | boolean
    delete?: TagWhereInput | boolean
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutProductsInput, TagUpdateWithoutProductsInput>, TagUncheckedUpdateWithoutProductsInput>
  }

  export type ProductVariantUncheckedUpdateManyWithoutProductNestedInput = {
    create?: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput> | ProductVariantCreateWithoutProductInput[] | ProductVariantUncheckedCreateWithoutProductInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutProductInput | ProductVariantCreateOrConnectWithoutProductInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutProductInput | ProductVariantUpsertWithWhereUniqueWithoutProductInput[]
    createMany?: ProductVariantCreateManyProductInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutProductInput | ProductVariantUpdateWithWhereUniqueWithoutProductInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutProductInput | ProductVariantUpdateManyWithWhereWithoutProductInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type ProductVariantCreateimagesInput = {
    set: string[]
  }

  export type ProductCreateNestedOneWithoutVariantsInput = {
    create?: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutVariantsInput
    connect?: ProductWhereUniqueInput
  }

  export type ProductVariantCreateNestedOneWithoutChildVariantsInput = {
    create?: XOR<ProductVariantCreateWithoutChildVariantsInput, ProductVariantUncheckedCreateWithoutChildVariantsInput>
    connectOrCreate?: ProductVariantCreateOrConnectWithoutChildVariantsInput
    connect?: ProductVariantWhereUniqueInput
  }

  export type ProductVariantCreateNestedManyWithoutParentVariantInput = {
    create?: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput> | ProductVariantCreateWithoutParentVariantInput[] | ProductVariantUncheckedCreateWithoutParentVariantInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutParentVariantInput | ProductVariantCreateOrConnectWithoutParentVariantInput[]
    createMany?: ProductVariantCreateManyParentVariantInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type ProductVariantUncheckedCreateNestedManyWithoutParentVariantInput = {
    create?: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput> | ProductVariantCreateWithoutParentVariantInput[] | ProductVariantUncheckedCreateWithoutParentVariantInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutParentVariantInput | ProductVariantCreateOrConnectWithoutParentVariantInput[]
    createMany?: ProductVariantCreateManyParentVariantInputEnvelope
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
  }

  export type ProductVariantUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProductUpdateOneRequiredWithoutVariantsNestedInput = {
    create?: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    connectOrCreate?: ProductCreateOrConnectWithoutVariantsInput
    upsert?: ProductUpsertWithoutVariantsInput
    connect?: ProductWhereUniqueInput
    update?: XOR<XOR<ProductUpdateToOneWithWhereWithoutVariantsInput, ProductUpdateWithoutVariantsInput>, ProductUncheckedUpdateWithoutVariantsInput>
  }

  export type ProductVariantUpdateOneWithoutChildVariantsNestedInput = {
    create?: XOR<ProductVariantCreateWithoutChildVariantsInput, ProductVariantUncheckedCreateWithoutChildVariantsInput>
    connectOrCreate?: ProductVariantCreateOrConnectWithoutChildVariantsInput
    upsert?: ProductVariantUpsertWithoutChildVariantsInput
    disconnect?: ProductVariantWhereInput | boolean
    delete?: ProductVariantWhereInput | boolean
    connect?: ProductVariantWhereUniqueInput
    update?: XOR<XOR<ProductVariantUpdateToOneWithWhereWithoutChildVariantsInput, ProductVariantUpdateWithoutChildVariantsInput>, ProductVariantUncheckedUpdateWithoutChildVariantsInput>
  }

  export type ProductVariantUpdateManyWithoutParentVariantNestedInput = {
    create?: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput> | ProductVariantCreateWithoutParentVariantInput[] | ProductVariantUncheckedCreateWithoutParentVariantInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutParentVariantInput | ProductVariantCreateOrConnectWithoutParentVariantInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutParentVariantInput | ProductVariantUpsertWithWhereUniqueWithoutParentVariantInput[]
    createMany?: ProductVariantCreateManyParentVariantInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutParentVariantInput | ProductVariantUpdateWithWhereUniqueWithoutParentVariantInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutParentVariantInput | ProductVariantUpdateManyWithWhereWithoutParentVariantInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type ProductVariantUncheckedUpdateManyWithoutParentVariantNestedInput = {
    create?: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput> | ProductVariantCreateWithoutParentVariantInput[] | ProductVariantUncheckedCreateWithoutParentVariantInput[]
    connectOrCreate?: ProductVariantCreateOrConnectWithoutParentVariantInput | ProductVariantCreateOrConnectWithoutParentVariantInput[]
    upsert?: ProductVariantUpsertWithWhereUniqueWithoutParentVariantInput | ProductVariantUpsertWithWhereUniqueWithoutParentVariantInput[]
    createMany?: ProductVariantCreateManyParentVariantInputEnvelope
    set?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    disconnect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    delete?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    connect?: ProductVariantWhereUniqueInput | ProductVariantWhereUniqueInput[]
    update?: ProductVariantUpdateWithWhereUniqueWithoutParentVariantInput | ProductVariantUpdateWithWhereUniqueWithoutParentVariantInput[]
    updateMany?: ProductVariantUpdateManyWithWhereWithoutParentVariantInput | ProductVariantUpdateManyWithWhereWithoutParentVariantInput[]
    deleteMany?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
  }

  export type ProductCreateNestedManyWithoutTagInput = {
    create?: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput> | ProductCreateWithoutTagInput[] | ProductUncheckedCreateWithoutTagInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutTagInput | ProductCreateOrConnectWithoutTagInput[]
    createMany?: ProductCreateManyTagInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput> | ProductCreateWithoutTagInput[] | ProductUncheckedCreateWithoutTagInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutTagInput | ProductCreateOrConnectWithoutTagInput[]
    createMany?: ProductCreateManyTagInputEnvelope
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
  }

  export type ProductUpdateManyWithoutTagNestedInput = {
    create?: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput> | ProductCreateWithoutTagInput[] | ProductUncheckedCreateWithoutTagInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutTagInput | ProductCreateOrConnectWithoutTagInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutTagInput | ProductUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: ProductCreateManyTagInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutTagInput | ProductUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutTagInput | ProductUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type ProductUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput> | ProductCreateWithoutTagInput[] | ProductUncheckedCreateWithoutTagInput[]
    connectOrCreate?: ProductCreateOrConnectWithoutTagInput | ProductCreateOrConnectWithoutTagInput[]
    upsert?: ProductUpsertWithWhereUniqueWithoutTagInput | ProductUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: ProductCreateManyTagInputEnvelope
    set?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    disconnect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    delete?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    connect?: ProductWhereUniqueInput | ProductWhereUniqueInput[]
    update?: ProductUpdateWithWhereUniqueWithoutTagInput | ProductUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: ProductUpdateManyWithWhereWithoutTagInput | ProductUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: ProductScalarWhereInput | ProductScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutReferralLogsUsedInput = {
    create?: XOR<UserCreateWithoutReferralLogsUsedInput, UserUncheckedCreateWithoutReferralLogsUsedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralLogsUsedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReferralLogsReceivedInput = {
    create?: XOR<UserCreateWithoutReferralLogsReceivedInput, UserUncheckedCreateWithoutReferralLogsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralLogsReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReferralLogsUsedNestedInput = {
    create?: XOR<UserCreateWithoutReferralLogsUsedInput, UserUncheckedCreateWithoutReferralLogsUsedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralLogsUsedInput
    upsert?: UserUpsertWithoutReferralLogsUsedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReferralLogsUsedInput, UserUpdateWithoutReferralLogsUsedInput>, UserUncheckedUpdateWithoutReferralLogsUsedInput>
  }

  export type UserUpdateOneRequiredWithoutReferralLogsReceivedNestedInput = {
    create?: XOR<UserCreateWithoutReferralLogsReceivedInput, UserUncheckedCreateWithoutReferralLogsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralLogsReceivedInput
    upsert?: UserUpsertWithoutReferralLogsReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReferralLogsReceivedInput, UserUpdateWithoutReferralLogsReceivedInput>, UserUncheckedUpdateWithoutReferralLogsReceivedInput>
  }

  export type UserCreateNestedOneWithoutReferralEarningsGeneratedInput = {
    create?: XOR<UserCreateWithoutReferralEarningsGeneratedInput, UserUncheckedCreateWithoutReferralEarningsGeneratedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralEarningsGeneratedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReferralEarningsReceivedInput = {
    create?: XOR<UserCreateWithoutReferralEarningsReceivedInput, UserUncheckedCreateWithoutReferralEarningsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralEarningsReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutReferralEarningsGeneratedNestedInput = {
    create?: XOR<UserCreateWithoutReferralEarningsGeneratedInput, UserUncheckedCreateWithoutReferralEarningsGeneratedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralEarningsGeneratedInput
    upsert?: UserUpsertWithoutReferralEarningsGeneratedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReferralEarningsGeneratedInput, UserUpdateWithoutReferralEarningsGeneratedInput>, UserUncheckedUpdateWithoutReferralEarningsGeneratedInput>
  }

  export type UserUpdateOneRequiredWithoutReferralEarningsReceivedNestedInput = {
    create?: XOR<UserCreateWithoutReferralEarningsReceivedInput, UserUncheckedCreateWithoutReferralEarningsReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutReferralEarningsReceivedInput
    upsert?: UserUpsertWithoutReferralEarningsReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReferralEarningsReceivedInput, UserUpdateWithoutReferralEarningsReceivedInput>, UserUncheckedUpdateWithoutReferralEarningsReceivedInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type UserCreateWithoutReferredUsersInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateWithoutReferredUsersInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserCreateOrConnectWithoutReferredUsersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferredUsersInput, UserUncheckedCreateWithoutReferredUsersInput>
  }

  export type UserCreateWithoutReferrerInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateWithoutReferrerInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserCreateOrConnectWithoutReferrerInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput>
  }

  export type UserCreateManyReferrerInputEnvelope = {
    data: UserCreateManyReferrerInput | UserCreateManyReferrerInput[]
    skipDuplicates?: boolean
  }

  export type ReferralLogCreateWithoutUserInput = {
    codeUsed: string
    createdAt?: Date | string
    referer: UserCreateNestedOneWithoutReferralLogsReceivedInput
  }

  export type ReferralLogUncheckedCreateWithoutUserInput = {
    id?: number
    codeUsed: string
    refererId: number
    createdAt?: Date | string
  }

  export type ReferralLogCreateOrConnectWithoutUserInput = {
    where: ReferralLogWhereUniqueInput
    create: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput>
  }

  export type ReferralLogCreateManyUserInputEnvelope = {
    data: ReferralLogCreateManyUserInput | ReferralLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReferralLogCreateWithoutRefererInput = {
    codeUsed: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutReferralLogsUsedInput
  }

  export type ReferralLogUncheckedCreateWithoutRefererInput = {
    id?: number
    userId: number
    codeUsed: string
    createdAt?: Date | string
  }

  export type ReferralLogCreateOrConnectWithoutRefererInput = {
    where: ReferralLogWhereUniqueInput
    create: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput>
  }

  export type ReferralLogCreateManyRefererInputEnvelope = {
    data: ReferralLogCreateManyRefererInput | ReferralLogCreateManyRefererInput[]
    skipDuplicates?: boolean
  }

  export type ReferralEarningsLogCreateWithoutUserInput = {
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    referer: UserCreateNestedOneWithoutReferralEarningsReceivedInput
  }

  export type ReferralEarningsLogUncheckedCreateWithoutUserInput = {
    id?: number
    refererId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogCreateOrConnectWithoutUserInput = {
    where: ReferralEarningsLogWhereUniqueInput
    create: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput>
  }

  export type ReferralEarningsLogCreateManyUserInputEnvelope = {
    data: ReferralEarningsLogCreateManyUserInput | ReferralEarningsLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ReferralEarningsLogCreateWithoutRefererInput = {
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutReferralEarningsGeneratedInput
  }

  export type ReferralEarningsLogUncheckedCreateWithoutRefererInput = {
    id?: number
    userId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogCreateOrConnectWithoutRefererInput = {
    where: ReferralEarningsLogWhereUniqueInput
    create: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput>
  }

  export type ReferralEarningsLogCreateManyRefererInputEnvelope = {
    data: ReferralEarningsLogCreateManyRefererInput | ReferralEarningsLogCreateManyRefererInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutReferredUsersInput = {
    update: XOR<UserUpdateWithoutReferredUsersInput, UserUncheckedUpdateWithoutReferredUsersInput>
    create: XOR<UserCreateWithoutReferredUsersInput, UserUncheckedCreateWithoutReferredUsersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReferredUsersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReferredUsersInput, UserUncheckedUpdateWithoutReferredUsersInput>
  }

  export type UserUpdateWithoutReferredUsersInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateWithoutReferredUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutReferrerInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutReferrerInput, UserUncheckedUpdateWithoutReferrerInput>
    create: XOR<UserCreateWithoutReferrerInput, UserUncheckedCreateWithoutReferrerInput>
  }

  export type UserUpdateWithWhereUniqueWithoutReferrerInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutReferrerInput, UserUncheckedUpdateWithoutReferrerInput>
  }

  export type UserUpdateManyWithWhereWithoutReferrerInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutReferrerInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    referralCode?: StringFilter<"User"> | string
    referrerId?: IntNullableFilter<"User"> | number | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    enabled?: BoolFilter<"User"> | boolean
    totalReferralEarnings?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFilter<"User"> | number
  }

  export type ReferralLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ReferralLogWhereUniqueInput
    update: XOR<ReferralLogUpdateWithoutUserInput, ReferralLogUncheckedUpdateWithoutUserInput>
    create: XOR<ReferralLogCreateWithoutUserInput, ReferralLogUncheckedCreateWithoutUserInput>
  }

  export type ReferralLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ReferralLogWhereUniqueInput
    data: XOR<ReferralLogUpdateWithoutUserInput, ReferralLogUncheckedUpdateWithoutUserInput>
  }

  export type ReferralLogUpdateManyWithWhereWithoutUserInput = {
    where: ReferralLogScalarWhereInput
    data: XOR<ReferralLogUpdateManyMutationInput, ReferralLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ReferralLogScalarWhereInput = {
    AND?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
    OR?: ReferralLogScalarWhereInput[]
    NOT?: ReferralLogScalarWhereInput | ReferralLogScalarWhereInput[]
    id?: IntFilter<"ReferralLog"> | number
    userId?: IntFilter<"ReferralLog"> | number
    codeUsed?: StringFilter<"ReferralLog"> | string
    refererId?: IntFilter<"ReferralLog"> | number
    createdAt?: DateTimeFilter<"ReferralLog"> | Date | string
  }

  export type ReferralLogUpsertWithWhereUniqueWithoutRefererInput = {
    where: ReferralLogWhereUniqueInput
    update: XOR<ReferralLogUpdateWithoutRefererInput, ReferralLogUncheckedUpdateWithoutRefererInput>
    create: XOR<ReferralLogCreateWithoutRefererInput, ReferralLogUncheckedCreateWithoutRefererInput>
  }

  export type ReferralLogUpdateWithWhereUniqueWithoutRefererInput = {
    where: ReferralLogWhereUniqueInput
    data: XOR<ReferralLogUpdateWithoutRefererInput, ReferralLogUncheckedUpdateWithoutRefererInput>
  }

  export type ReferralLogUpdateManyWithWhereWithoutRefererInput = {
    where: ReferralLogScalarWhereInput
    data: XOR<ReferralLogUpdateManyMutationInput, ReferralLogUncheckedUpdateManyWithoutRefererInput>
  }

  export type ReferralEarningsLogUpsertWithWhereUniqueWithoutUserInput = {
    where: ReferralEarningsLogWhereUniqueInput
    update: XOR<ReferralEarningsLogUpdateWithoutUserInput, ReferralEarningsLogUncheckedUpdateWithoutUserInput>
    create: XOR<ReferralEarningsLogCreateWithoutUserInput, ReferralEarningsLogUncheckedCreateWithoutUserInput>
  }

  export type ReferralEarningsLogUpdateWithWhereUniqueWithoutUserInput = {
    where: ReferralEarningsLogWhereUniqueInput
    data: XOR<ReferralEarningsLogUpdateWithoutUserInput, ReferralEarningsLogUncheckedUpdateWithoutUserInput>
  }

  export type ReferralEarningsLogUpdateManyWithWhereWithoutUserInput = {
    where: ReferralEarningsLogScalarWhereInput
    data: XOR<ReferralEarningsLogUpdateManyMutationInput, ReferralEarningsLogUncheckedUpdateManyWithoutUserInput>
  }

  export type ReferralEarningsLogScalarWhereInput = {
    AND?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
    OR?: ReferralEarningsLogScalarWhereInput[]
    NOT?: ReferralEarningsLogScalarWhereInput | ReferralEarningsLogScalarWhereInput[]
    id?: IntFilter<"ReferralEarningsLog"> | number
    userId?: IntFilter<"ReferralEarningsLog"> | number
    refererId?: IntFilter<"ReferralEarningsLog"> | number
    shopifyOrderId?: StringNullableFilter<"ReferralEarningsLog"> | string | null
    amount?: DecimalFilter<"ReferralEarningsLog"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"ReferralEarningsLog"> | Date | string
  }

  export type ReferralEarningsLogUpsertWithWhereUniqueWithoutRefererInput = {
    where: ReferralEarningsLogWhereUniqueInput
    update: XOR<ReferralEarningsLogUpdateWithoutRefererInput, ReferralEarningsLogUncheckedUpdateWithoutRefererInput>
    create: XOR<ReferralEarningsLogCreateWithoutRefererInput, ReferralEarningsLogUncheckedCreateWithoutRefererInput>
  }

  export type ReferralEarningsLogUpdateWithWhereUniqueWithoutRefererInput = {
    where: ReferralEarningsLogWhereUniqueInput
    data: XOR<ReferralEarningsLogUpdateWithoutRefererInput, ReferralEarningsLogUncheckedUpdateWithoutRefererInput>
  }

  export type ReferralEarningsLogUpdateManyWithWhereWithoutRefererInput = {
    where: ReferralEarningsLogScalarWhereInput
    data: XOR<ReferralEarningsLogUpdateManyMutationInput, ReferralEarningsLogUncheckedUpdateManyWithoutRefererInput>
  }

  export type ProductCreateWithoutVendorInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    productType?: ProductTypeCreateNestedOneWithoutProductsInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    category?: CategoryCreateNestedOneWithoutProductsInput
    tag?: TagCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutVendorInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutVendorInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput>
  }

  export type ProductCreateManyVendorInputEnvelope = {
    data: ProductCreateManyVendorInput | ProductCreateManyVendorInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutVendorInput, ProductUncheckedUpdateWithoutVendorInput>
    create: XOR<ProductCreateWithoutVendorInput, ProductUncheckedCreateWithoutVendorInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutVendorInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutVendorInput, ProductUncheckedUpdateWithoutVendorInput>
  }

  export type ProductUpdateManyWithWhereWithoutVendorInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutVendorInput>
  }

  export type ProductScalarWhereInput = {
    AND?: ProductScalarWhereInput | ProductScalarWhereInput[]
    OR?: ProductScalarWhereInput[]
    NOT?: ProductScalarWhereInput | ProductScalarWhereInput[]
    id?: IntFilter<"Product"> | number
    title?: StringFilter<"Product"> | string
    slug?: StringFilter<"Product"> | string
    description?: StringNullableFilter<"Product"> | string | null
    vendorId?: IntNullableFilter<"Product"> | number | null
    productTypeId?: IntNullableFilter<"Product"> | number | null
    published?: BoolFilter<"Product"> | boolean
    publishedAt?: DateTimeNullableFilter<"Product"> | Date | string | null
    price?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"Product"> | Decimal | DecimalJsLike | number | string | null
    sku?: StringNullableFilter<"Product"> | string | null
    inventoryQuantity?: IntNullableFilter<"Product"> | number | null
    available?: BoolFilter<"Product"> | boolean
    referralPercentage?: FloatFilter<"Product"> | number
    shopifyProductId?: StringNullableFilter<"Product"> | string | null
    images?: StringNullableListFilter<"Product">
    categoryId?: IntNullableFilter<"Product"> | number | null
    tagId?: IntNullableFilter<"Product"> | number | null
    createdAt?: DateTimeFilter<"Product"> | Date | string
    updatedAt?: DateTimeFilter<"Product"> | Date | string
    enabled?: BoolFilter<"Product"> | boolean
  }

  export type ProductCreateWithoutProductTypeInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    vendor?: VendorCreateNestedOneWithoutProductsInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    category?: CategoryCreateNestedOneWithoutProductsInput
    tag?: TagCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutProductTypeInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutProductTypeInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput>
  }

  export type ProductCreateManyProductTypeInputEnvelope = {
    data: ProductCreateManyProductTypeInput | ProductCreateManyProductTypeInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutProductTypeInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutProductTypeInput, ProductUncheckedUpdateWithoutProductTypeInput>
    create: XOR<ProductCreateWithoutProductTypeInput, ProductUncheckedCreateWithoutProductTypeInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutProductTypeInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutProductTypeInput, ProductUncheckedUpdateWithoutProductTypeInput>
  }

  export type ProductUpdateManyWithWhereWithoutProductTypeInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutProductTypeInput>
  }

  export type ProductCreateWithoutCategoryInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    vendor?: VendorCreateNestedOneWithoutProductsInput
    productType?: ProductTypeCreateNestedOneWithoutProductsInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    tag?: TagCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutCategoryInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductCreateManyCategoryInputEnvelope = {
    data: ProductCreateManyCategoryInput | ProductCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
    create: XOR<ProductCreateWithoutCategoryInput, ProductUncheckedCreateWithoutCategoryInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutCategoryInput, ProductUncheckedUpdateWithoutCategoryInput>
  }

  export type ProductUpdateManyWithWhereWithoutCategoryInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutCategoryInput>
  }

  export type VendorCreateWithoutProductsInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type VendorUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type VendorCreateOrConnectWithoutProductsInput = {
    where: VendorWhereUniqueInput
    create: XOR<VendorCreateWithoutProductsInput, VendorUncheckedCreateWithoutProductsInput>
  }

  export type ProductTypeCreateWithoutProductsInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductTypeUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductTypeCreateOrConnectWithoutProductsInput = {
    where: ProductTypeWhereUniqueInput
    create: XOR<ProductTypeCreateWithoutProductsInput, ProductTypeUncheckedCreateWithoutProductsInput>
  }

  export type ProductVariantCreateWithoutProductInput = {
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    parentVariant?: ProductVariantCreateNestedOneWithoutChildVariantsInput
    childVariants?: ProductVariantCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantUncheckedCreateWithoutProductInput = {
    id?: number
    parentVariantId?: number | null
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    childVariants?: ProductVariantUncheckedCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantCreateOrConnectWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    create: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductVariantCreateManyProductInputEnvelope = {
    data: ProductVariantCreateManyProductInput | ProductVariantCreateManyProductInput[]
    skipDuplicates?: boolean
  }

  export type CategoryCreateWithoutProductsInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type CategoryUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type CategoryCreateOrConnectWithoutProductsInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
  }

  export type TagCreateWithoutProductsInput = {
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type TagUncheckedCreateWithoutProductsInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type TagCreateOrConnectWithoutProductsInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutProductsInput, TagUncheckedCreateWithoutProductsInput>
  }

  export type VendorUpsertWithoutProductsInput = {
    update: XOR<VendorUpdateWithoutProductsInput, VendorUncheckedUpdateWithoutProductsInput>
    create: XOR<VendorCreateWithoutProductsInput, VendorUncheckedCreateWithoutProductsInput>
    where?: VendorWhereInput
  }

  export type VendorUpdateToOneWithWhereWithoutProductsInput = {
    where?: VendorWhereInput
    data: XOR<VendorUpdateWithoutProductsInput, VendorUncheckedUpdateWithoutProductsInput>
  }

  export type VendorUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type VendorUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductTypeUpsertWithoutProductsInput = {
    update: XOR<ProductTypeUpdateWithoutProductsInput, ProductTypeUncheckedUpdateWithoutProductsInput>
    create: XOR<ProductTypeCreateWithoutProductsInput, ProductTypeUncheckedCreateWithoutProductsInput>
    where?: ProductTypeWhereInput
  }

  export type ProductTypeUpdateToOneWithWhereWithoutProductsInput = {
    where?: ProductTypeWhereInput
    data: XOR<ProductTypeUpdateWithoutProductsInput, ProductTypeUncheckedUpdateWithoutProductsInput>
  }

  export type ProductTypeUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductTypeUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantUpsertWithWhereUniqueWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    update: XOR<ProductVariantUpdateWithoutProductInput, ProductVariantUncheckedUpdateWithoutProductInput>
    create: XOR<ProductVariantCreateWithoutProductInput, ProductVariantUncheckedCreateWithoutProductInput>
  }

  export type ProductVariantUpdateWithWhereUniqueWithoutProductInput = {
    where: ProductVariantWhereUniqueInput
    data: XOR<ProductVariantUpdateWithoutProductInput, ProductVariantUncheckedUpdateWithoutProductInput>
  }

  export type ProductVariantUpdateManyWithWhereWithoutProductInput = {
    where: ProductVariantScalarWhereInput
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyWithoutProductInput>
  }

  export type ProductVariantScalarWhereInput = {
    AND?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
    OR?: ProductVariantScalarWhereInput[]
    NOT?: ProductVariantScalarWhereInput | ProductVariantScalarWhereInput[]
    id?: IntFilter<"ProductVariant"> | number
    productId?: IntFilter<"ProductVariant"> | number
    parentVariantId?: IntNullableFilter<"ProductVariant"> | number | null
    shopifyProductId?: StringNullableFilter<"ProductVariant"> | string | null
    title?: StringFilter<"ProductVariant"> | string
    sku?: StringNullableFilter<"ProductVariant"> | string | null
    price?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: DecimalNullableFilter<"ProductVariant"> | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFilter<"ProductVariant"> | number
    available?: BoolFilter<"ProductVariant"> | boolean
    inventoryQuantity?: IntFilter<"ProductVariant"> | number
    images?: StringNullableListFilter<"ProductVariant">
    weight?: IntNullableFilter<"ProductVariant"> | number | null
    requiresShipping?: BoolFilter<"ProductVariant"> | boolean
    taxable?: BoolFilter<"ProductVariant"> | boolean
    shopifyVariantId?: StringNullableFilter<"ProductVariant"> | string | null
    position?: IntFilter<"ProductVariant"> | number
    createdAt?: DateTimeFilter<"ProductVariant"> | Date | string
    updatedAt?: DateTimeFilter<"ProductVariant"> | Date | string
    enabled?: BoolFilter<"ProductVariant"> | boolean
  }

  export type CategoryUpsertWithoutProductsInput = {
    update: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
    create: XOR<CategoryCreateWithoutProductsInput, CategoryUncheckedCreateWithoutProductsInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutProductsInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutProductsInput, CategoryUncheckedUpdateWithoutProductsInput>
  }

  export type CategoryUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CategoryUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TagUpsertWithoutProductsInput = {
    update: XOR<TagUpdateWithoutProductsInput, TagUncheckedUpdateWithoutProductsInput>
    create: XOR<TagCreateWithoutProductsInput, TagUncheckedCreateWithoutProductsInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutProductsInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutProductsInput, TagUncheckedUpdateWithoutProductsInput>
  }

  export type TagUpdateWithoutProductsInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TagUncheckedUpdateWithoutProductsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateWithoutVariantsInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    vendor?: VendorCreateNestedOneWithoutProductsInput
    productType?: ProductTypeCreateNestedOneWithoutProductsInput
    category?: CategoryCreateNestedOneWithoutProductsInput
    tag?: TagCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutVariantsInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductCreateOrConnectWithoutVariantsInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
  }

  export type ProductVariantCreateWithoutChildVariantsInput = {
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    product: ProductCreateNestedOneWithoutVariantsInput
    parentVariant?: ProductVariantCreateNestedOneWithoutChildVariantsInput
  }

  export type ProductVariantUncheckedCreateWithoutChildVariantsInput = {
    id?: number
    productId: number
    parentVariantId?: number | null
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductVariantCreateOrConnectWithoutChildVariantsInput = {
    where: ProductVariantWhereUniqueInput
    create: XOR<ProductVariantCreateWithoutChildVariantsInput, ProductVariantUncheckedCreateWithoutChildVariantsInput>
  }

  export type ProductVariantCreateWithoutParentVariantInput = {
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    product: ProductCreateNestedOneWithoutVariantsInput
    childVariants?: ProductVariantCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantUncheckedCreateWithoutParentVariantInput = {
    id?: number
    productId: number
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    childVariants?: ProductVariantUncheckedCreateNestedManyWithoutParentVariantInput
  }

  export type ProductVariantCreateOrConnectWithoutParentVariantInput = {
    where: ProductVariantWhereUniqueInput
    create: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput>
  }

  export type ProductVariantCreateManyParentVariantInputEnvelope = {
    data: ProductVariantCreateManyParentVariantInput | ProductVariantCreateManyParentVariantInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithoutVariantsInput = {
    update: XOR<ProductUpdateWithoutVariantsInput, ProductUncheckedUpdateWithoutVariantsInput>
    create: XOR<ProductCreateWithoutVariantsInput, ProductUncheckedCreateWithoutVariantsInput>
    where?: ProductWhereInput
  }

  export type ProductUpdateToOneWithWhereWithoutVariantsInput = {
    where?: ProductWhereInput
    data: XOR<ProductUpdateWithoutVariantsInput, ProductUncheckedUpdateWithoutVariantsInput>
  }

  export type ProductUpdateWithoutVariantsInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    vendor?: VendorUpdateOneWithoutProductsNestedInput
    productType?: ProductTypeUpdateOneWithoutProductsNestedInput
    category?: CategoryUpdateOneWithoutProductsNestedInput
    tag?: TagUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutVariantsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantUpsertWithoutChildVariantsInput = {
    update: XOR<ProductVariantUpdateWithoutChildVariantsInput, ProductVariantUncheckedUpdateWithoutChildVariantsInput>
    create: XOR<ProductVariantCreateWithoutChildVariantsInput, ProductVariantUncheckedCreateWithoutChildVariantsInput>
    where?: ProductVariantWhereInput
  }

  export type ProductVariantUpdateToOneWithWhereWithoutChildVariantsInput = {
    where?: ProductVariantWhereInput
    data: XOR<ProductVariantUpdateWithoutChildVariantsInput, ProductVariantUncheckedUpdateWithoutChildVariantsInput>
  }

  export type ProductVariantUpdateWithoutChildVariantsInput = {
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    product?: ProductUpdateOneRequiredWithoutVariantsNestedInput
    parentVariant?: ProductVariantUpdateOneWithoutChildVariantsNestedInput
  }

  export type ProductVariantUncheckedUpdateWithoutChildVariantsInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    parentVariantId?: NullableIntFieldUpdateOperationsInput | number | null
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantUpsertWithWhereUniqueWithoutParentVariantInput = {
    where: ProductVariantWhereUniqueInput
    update: XOR<ProductVariantUpdateWithoutParentVariantInput, ProductVariantUncheckedUpdateWithoutParentVariantInput>
    create: XOR<ProductVariantCreateWithoutParentVariantInput, ProductVariantUncheckedCreateWithoutParentVariantInput>
  }

  export type ProductVariantUpdateWithWhereUniqueWithoutParentVariantInput = {
    where: ProductVariantWhereUniqueInput
    data: XOR<ProductVariantUpdateWithoutParentVariantInput, ProductVariantUncheckedUpdateWithoutParentVariantInput>
  }

  export type ProductVariantUpdateManyWithWhereWithoutParentVariantInput = {
    where: ProductVariantScalarWhereInput
    data: XOR<ProductVariantUpdateManyMutationInput, ProductVariantUncheckedUpdateManyWithoutParentVariantInput>
  }

  export type ProductCreateWithoutTagInput = {
    title: string
    slug: string
    description?: string | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    vendor?: VendorCreateNestedOneWithoutProductsInput
    productType?: ProductTypeCreateNestedOneWithoutProductsInput
    variants?: ProductVariantCreateNestedManyWithoutProductInput
    category?: CategoryCreateNestedOneWithoutProductsInput
  }

  export type ProductUncheckedCreateWithoutTagInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    variants?: ProductVariantUncheckedCreateNestedManyWithoutProductInput
  }

  export type ProductCreateOrConnectWithoutTagInput = {
    where: ProductWhereUniqueInput
    create: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput>
  }

  export type ProductCreateManyTagInputEnvelope = {
    data: ProductCreateManyTagInput | ProductCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type ProductUpsertWithWhereUniqueWithoutTagInput = {
    where: ProductWhereUniqueInput
    update: XOR<ProductUpdateWithoutTagInput, ProductUncheckedUpdateWithoutTagInput>
    create: XOR<ProductCreateWithoutTagInput, ProductUncheckedCreateWithoutTagInput>
  }

  export type ProductUpdateWithWhereUniqueWithoutTagInput = {
    where: ProductWhereUniqueInput
    data: XOR<ProductUpdateWithoutTagInput, ProductUncheckedUpdateWithoutTagInput>
  }

  export type ProductUpdateManyWithWhereWithoutTagInput = {
    where: ProductScalarWhereInput
    data: XOR<ProductUpdateManyMutationInput, ProductUncheckedUpdateManyWithoutTagInput>
  }

  export type UserCreateWithoutReferralLogsUsedInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateWithoutReferralLogsUsedInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserCreateOrConnectWithoutReferralLogsUsedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferralLogsUsedInput, UserUncheckedCreateWithoutReferralLogsUsedInput>
  }

  export type UserCreateWithoutReferralLogsReceivedInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateWithoutReferralLogsReceivedInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserCreateOrConnectWithoutReferralLogsReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferralLogsReceivedInput, UserUncheckedCreateWithoutReferralLogsReceivedInput>
  }

  export type UserUpsertWithoutReferralLogsUsedInput = {
    update: XOR<UserUpdateWithoutReferralLogsUsedInput, UserUncheckedUpdateWithoutReferralLogsUsedInput>
    create: XOR<UserCreateWithoutReferralLogsUsedInput, UserUncheckedCreateWithoutReferralLogsUsedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReferralLogsUsedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReferralLogsUsedInput, UserUncheckedUpdateWithoutReferralLogsUsedInput>
  }

  export type UserUpdateWithoutReferralLogsUsedInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateWithoutReferralLogsUsedInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserUpsertWithoutReferralLogsReceivedInput = {
    update: XOR<UserUpdateWithoutReferralLogsReceivedInput, UserUncheckedUpdateWithoutReferralLogsReceivedInput>
    create: XOR<UserCreateWithoutReferralLogsReceivedInput, UserUncheckedCreateWithoutReferralLogsReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReferralLogsReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReferralLogsReceivedInput, UserUncheckedUpdateWithoutReferralLogsReceivedInput>
  }

  export type UserUpdateWithoutReferralLogsReceivedInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateWithoutReferralLogsReceivedInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserCreateWithoutReferralEarningsGeneratedInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsReceived?: ReferralEarningsLogCreateNestedManyWithoutRefererInput
  }

  export type UserUncheckedCreateWithoutReferralEarningsGeneratedInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedCreateNestedManyWithoutRefererInput
  }

  export type UserCreateOrConnectWithoutReferralEarningsGeneratedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferralEarningsGeneratedInput, UserUncheckedCreateWithoutReferralEarningsGeneratedInput>
  }

  export type UserCreateWithoutReferralEarningsReceivedInput = {
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referrer?: UserCreateNestedOneWithoutReferredUsersInput
    referredUsers?: UserCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReferralEarningsReceivedInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    referrerId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
    referredUsers?: UserUncheckedCreateNestedManyWithoutReferrerInput
    referralLogsUsed?: ReferralLogUncheckedCreateNestedManyWithoutUserInput
    referralLogsReceived?: ReferralLogUncheckedCreateNestedManyWithoutRefererInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReferralEarningsReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReferralEarningsReceivedInput, UserUncheckedCreateWithoutReferralEarningsReceivedInput>
  }

  export type UserUpsertWithoutReferralEarningsGeneratedInput = {
    update: XOR<UserUpdateWithoutReferralEarningsGeneratedInput, UserUncheckedUpdateWithoutReferralEarningsGeneratedInput>
    create: XOR<UserCreateWithoutReferralEarningsGeneratedInput, UserUncheckedCreateWithoutReferralEarningsGeneratedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReferralEarningsGeneratedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReferralEarningsGeneratedInput, UserUncheckedUpdateWithoutReferralEarningsGeneratedInput>
  }

  export type UserUpdateWithoutReferralEarningsGeneratedInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateWithoutReferralEarningsGeneratedInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserUpsertWithoutReferralEarningsReceivedInput = {
    update: XOR<UserUpdateWithoutReferralEarningsReceivedInput, UserUncheckedUpdateWithoutReferralEarningsReceivedInput>
    create: XOR<UserCreateWithoutReferralEarningsReceivedInput, UserUncheckedCreateWithoutReferralEarningsReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReferralEarningsReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReferralEarningsReceivedInput, UserUncheckedUpdateWithoutReferralEarningsReceivedInput>
  }

  export type UserUpdateWithoutReferralEarningsReceivedInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referrer?: UserUpdateOneWithoutReferredUsersNestedInput
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReferralEarningsReceivedInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    referrerId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyReferrerInput = {
    id?: number
    name?: string | null
    email: string
    role?: $Enums.UserRole
    referralCode: string
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
    totalReferralEarnings?: Decimal | DecimalJsLike | number | string
    withdrawableBalance?: Decimal | DecimalJsLike | number | string
    totalReferredUsers?: number
  }

  export type ReferralLogCreateManyUserInput = {
    id?: number
    codeUsed: string
    refererId: number
    createdAt?: Date | string
  }

  export type ReferralLogCreateManyRefererInput = {
    id?: number
    userId: number
    codeUsed: string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogCreateManyUserInput = {
    id?: number
    refererId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type ReferralEarningsLogCreateManyRefererInput = {
    id?: number
    userId: number
    shopifyOrderId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutReferrerInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateWithoutReferrerInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
    referredUsers?: UserUncheckedUpdateManyWithoutReferrerNestedInput
    referralLogsUsed?: ReferralLogUncheckedUpdateManyWithoutUserNestedInput
    referralLogsReceived?: ReferralLogUncheckedUpdateManyWithoutRefererNestedInput
    referralEarningsGenerated?: ReferralEarningsLogUncheckedUpdateManyWithoutUserNestedInput
    referralEarningsReceived?: ReferralEarningsLogUncheckedUpdateManyWithoutRefererNestedInput
  }

  export type UserUncheckedUpdateManyWithoutReferrerInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    referralCode?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    totalReferralEarnings?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    withdrawableBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalReferredUsers?: IntFieldUpdateOperationsInput | number
  }

  export type ReferralLogUpdateWithoutUserInput = {
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    referer?: UserUpdateOneRequiredWithoutReferralLogsReceivedNestedInput
  }

  export type ReferralLogUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    refererId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralLogUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    refererId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralLogUpdateWithoutRefererInput = {
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReferralLogsUsedNestedInput
  }

  export type ReferralLogUncheckedUpdateWithoutRefererInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralLogUncheckedUpdateManyWithoutRefererInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    codeUsed?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogUpdateWithoutUserInput = {
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    referer?: UserUpdateOneRequiredWithoutReferralEarningsReceivedNestedInput
  }

  export type ReferralEarningsLogUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    refererId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    refererId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogUpdateWithoutRefererInput = {
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutReferralEarningsGeneratedNestedInput
  }

  export type ReferralEarningsLogUncheckedUpdateWithoutRefererInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReferralEarningsLogUncheckedUpdateManyWithoutRefererInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    shopifyOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductCreateManyVendorInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductUpdateWithoutVendorInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    productType?: ProductTypeUpdateOneWithoutProductsNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    category?: CategoryUpdateOneWithoutProductsNestedInput
    tag?: TagUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutVendorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutVendorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateManyProductTypeInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductUpdateWithoutProductTypeInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    vendor?: VendorUpdateOneWithoutProductsNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    category?: CategoryUpdateOneWithoutProductsNestedInput
    tag?: TagUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutProductTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutProductTypeInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateManyCategoryInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    tagId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductUpdateWithoutCategoryInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    vendor?: VendorUpdateOneWithoutProductsNestedInput
    productType?: ProductTypeUpdateOneWithoutProductsNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    tag?: TagUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    tagId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantCreateManyProductInput = {
    id?: number
    parentVariantId?: number | null
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductVariantUpdateWithoutProductInput = {
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    parentVariant?: ProductVariantUpdateOneWithoutChildVariantsNestedInput
    childVariants?: ProductVariantUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantUncheckedUpdateWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    parentVariantId?: NullableIntFieldUpdateOperationsInput | number | null
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    childVariants?: ProductVariantUncheckedUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantUncheckedUpdateManyWithoutProductInput = {
    id?: IntFieldUpdateOperationsInput | number
    parentVariantId?: NullableIntFieldUpdateOperationsInput | number | null
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductVariantCreateManyParentVariantInput = {
    id?: number
    productId: number
    shopifyProductId?: string | null
    title: string
    sku?: string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    referralPercentage?: number
    available?: boolean
    inventoryQuantity?: number
    images?: ProductVariantCreateimagesInput | string[]
    weight?: number | null
    requiresShipping?: boolean
    taxable?: boolean
    shopifyVariantId?: string | null
    position?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductVariantUpdateWithoutParentVariantInput = {
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    product?: ProductUpdateOneRequiredWithoutVariantsNestedInput
    childVariants?: ProductVariantUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantUncheckedUpdateWithoutParentVariantInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    childVariants?: ProductVariantUncheckedUpdateManyWithoutParentVariantNestedInput
  }

  export type ProductVariantUncheckedUpdateManyWithoutParentVariantInput = {
    id?: IntFieldUpdateOperationsInput | number
    productId?: IntFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    title?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    available?: BoolFieldUpdateOperationsInput | boolean
    inventoryQuantity?: IntFieldUpdateOperationsInput | number
    images?: ProductVariantUpdateimagesInput | string[]
    weight?: NullableIntFieldUpdateOperationsInput | number | null
    requiresShipping?: BoolFieldUpdateOperationsInput | boolean
    taxable?: BoolFieldUpdateOperationsInput | boolean
    shopifyVariantId?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProductCreateManyTagInput = {
    id?: number
    title: string
    slug: string
    description?: string | null
    vendorId?: number | null
    productTypeId?: number | null
    published?: boolean
    publishedAt?: Date | string | null
    price?: Decimal | DecimalJsLike | number | string | null
    discountedPrice?: Decimal | DecimalJsLike | number | string | null
    sku?: string | null
    inventoryQuantity?: number | null
    available?: boolean
    referralPercentage?: number
    shopifyProductId?: string | null
    images?: ProductCreateimagesInput | string[]
    categoryId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    enabled?: boolean
  }

  export type ProductUpdateWithoutTagInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    vendor?: VendorUpdateOneWithoutProductsNestedInput
    productType?: ProductTypeUpdateOneWithoutProductsNestedInput
    variants?: ProductVariantUpdateManyWithoutProductNestedInput
    category?: CategoryUpdateOneWithoutProductsNestedInput
  }

  export type ProductUncheckedUpdateWithoutTagInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    variants?: ProductVariantUncheckedUpdateManyWithoutProductNestedInput
  }

  export type ProductUncheckedUpdateManyWithoutTagInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    vendorId?: NullableIntFieldUpdateOperationsInput | number | null
    productTypeId?: NullableIntFieldUpdateOperationsInput | number | null
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    discountedPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    inventoryQuantity?: NullableIntFieldUpdateOperationsInput | number | null
    available?: BoolFieldUpdateOperationsInput | boolean
    referralPercentage?: FloatFieldUpdateOperationsInput | number
    shopifyProductId?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProductUpdateimagesInput | string[]
    categoryId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}