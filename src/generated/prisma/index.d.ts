
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Business
 * 
 */
export type Business = $Result.DefaultSelection<Prisma.$BusinessPayload>
/**
 * Model Staff
 * 
 */
export type Staff = $Result.DefaultSelection<Prisma.$StaffPayload>
/**
 * Model ServiceCategory
 * 
 */
export type ServiceCategory = $Result.DefaultSelection<Prisma.$ServiceCategoryPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model ClientSensitiveInfo
 * 
 */
export type ClientSensitiveInfo = $Result.DefaultSelection<Prisma.$ClientSensitiveInfoPayload>
/**
 * Model Service
 * 
 */
export type Service = $Result.DefaultSelection<Prisma.$ServicePayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Schedule
 * 
 */
export type Schedule = $Result.DefaultSelection<Prisma.$SchedulePayload>
/**
 * Model BusinessHours
 * 
 */
export type BusinessHours = $Result.DefaultSelection<Prisma.$BusinessHoursPayload>
/**
 * Model ClientRelationship
 * 
 */
export type ClientRelationship = $Result.DefaultSelection<Prisma.$ClientRelationshipPayload>
/**
 * Model VisitHistory
 * 
 */
export type VisitHistory = $Result.DefaultSelection<Prisma.$VisitHistoryPayload>
/**
 * Model RelationshipNote
 * 
 */
export type RelationshipNote = $Result.DefaultSelection<Prisma.$RelationshipNotePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const BusinessType: {
  HAIR_SALON: 'HAIR_SALON',
  BARBERSHOP: 'BARBERSHOP',
  NAIL_SALON: 'NAIL_SALON',
  PHYSIOTHERAPY: 'PHYSIOTHERAPY',
  PSYCHOLOGY: 'PSYCHOLOGY',
  OTHER: 'OTHER'
};

export type BusinessType = (typeof BusinessType)[keyof typeof BusinessType]


export const StaffRole: {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  PROVIDER: 'PROVIDER'
};

export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole]


export const AppointmentStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]


export const PaymentStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const PaymentMethod: {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  CASH: 'CASH',
  TRANSFER: 'TRANSFER'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const ClientStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  VIP: 'VIP',
  BLOCKED: 'BLOCKED',
  POTENTIAL: 'POTENTIAL'
};

export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus]


export const ClientFlag: {
  ALLERGIES: 'ALLERGIES',
  MEDICAL_CONDITION: 'MEDICAL_CONDITION',
  PAYMENT_ISSUES: 'PAYMENT_ISSUES',
  SPECIAL_CARE: 'SPECIAL_CARE',
  VIP_TREATMENT: 'VIP_TREATMENT',
  CANCELLED_FREQUENTLY: 'CANCELLED_FREQUENTLY',
  RESCHEDULE_FREQUENTLY: 'RESCHEDULE_FREQUENTLY'
};

export type ClientFlag = (typeof ClientFlag)[keyof typeof ClientFlag]


export const NoteType: {
  GENERAL: 'GENERAL',
  PREFERENCE: 'PREFERENCE',
  INCIDENT: 'INCIDENT',
  FEEDBACK: 'FEEDBACK',
  FOLLOW_UP: 'FOLLOW_UP',
  SPECIAL_REQUEST: 'SPECIAL_REQUEST'
};

export type NoteType = (typeof NoteType)[keyof typeof NoteType]

}

export type BusinessType = $Enums.BusinessType

export const BusinessType: typeof $Enums.BusinessType

export type StaffRole = $Enums.StaffRole

export const StaffRole: typeof $Enums.StaffRole

export type AppointmentStatus = $Enums.AppointmentStatus

export const AppointmentStatus: typeof $Enums.AppointmentStatus

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type ClientStatus = $Enums.ClientStatus

export const ClientStatus: typeof $Enums.ClientStatus

export type ClientFlag = $Enums.ClientFlag

export const ClientFlag: typeof $Enums.ClientFlag

export type NoteType = $Enums.NoteType

export const NoteType: typeof $Enums.NoteType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Businesses
 * const businesses = await prisma.business.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Businesses
   * const businesses = await prisma.business.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.business`: Exposes CRUD operations for the **Business** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Businesses
    * const businesses = await prisma.business.findMany()
    * ```
    */
  get business(): Prisma.BusinessDelegate<ExtArgs>;

  /**
   * `prisma.staff`: Exposes CRUD operations for the **Staff** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Staff
    * const staff = await prisma.staff.findMany()
    * ```
    */
  get staff(): Prisma.StaffDelegate<ExtArgs>;

  /**
   * `prisma.serviceCategory`: Exposes CRUD operations for the **ServiceCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServiceCategories
    * const serviceCategories = await prisma.serviceCategory.findMany()
    * ```
    */
  get serviceCategory(): Prisma.ServiceCategoryDelegate<ExtArgs>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs>;

  /**
   * `prisma.clientSensitiveInfo`: Exposes CRUD operations for the **ClientSensitiveInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClientSensitiveInfos
    * const clientSensitiveInfos = await prisma.clientSensitiveInfo.findMany()
    * ```
    */
  get clientSensitiveInfo(): Prisma.ClientSensitiveInfoDelegate<ExtArgs>;

  /**
   * `prisma.service`: Exposes CRUD operations for the **Service** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Services
    * const services = await prisma.service.findMany()
    * ```
    */
  get service(): Prisma.ServiceDelegate<ExtArgs>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs>;

  /**
   * `prisma.schedule`: Exposes CRUD operations for the **Schedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Schedules
    * const schedules = await prisma.schedule.findMany()
    * ```
    */
  get schedule(): Prisma.ScheduleDelegate<ExtArgs>;

  /**
   * `prisma.businessHours`: Exposes CRUD operations for the **BusinessHours** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BusinessHours
    * const businessHours = await prisma.businessHours.findMany()
    * ```
    */
  get businessHours(): Prisma.BusinessHoursDelegate<ExtArgs>;

  /**
   * `prisma.clientRelationship`: Exposes CRUD operations for the **ClientRelationship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClientRelationships
    * const clientRelationships = await prisma.clientRelationship.findMany()
    * ```
    */
  get clientRelationship(): Prisma.ClientRelationshipDelegate<ExtArgs>;

  /**
   * `prisma.visitHistory`: Exposes CRUD operations for the **VisitHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VisitHistories
    * const visitHistories = await prisma.visitHistory.findMany()
    * ```
    */
  get visitHistory(): Prisma.VisitHistoryDelegate<ExtArgs>;

  /**
   * `prisma.relationshipNote`: Exposes CRUD operations for the **RelationshipNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RelationshipNotes
    * const relationshipNotes = await prisma.relationshipNote.findMany()
    * ```
    */
  get relationshipNote(): Prisma.RelationshipNoteDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
    Business: 'Business',
    Staff: 'Staff',
    ServiceCategory: 'ServiceCategory',
    Client: 'Client',
    ClientSensitiveInfo: 'ClientSensitiveInfo',
    Service: 'Service',
    Appointment: 'Appointment',
    Payment: 'Payment',
    Schedule: 'Schedule',
    BusinessHours: 'BusinessHours',
    ClientRelationship: 'ClientRelationship',
    VisitHistory: 'VisitHistory',
    RelationshipNote: 'RelationshipNote'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "business" | "staff" | "serviceCategory" | "client" | "clientSensitiveInfo" | "service" | "appointment" | "payment" | "schedule" | "businessHours" | "clientRelationship" | "visitHistory" | "relationshipNote"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Business: {
        payload: Prisma.$BusinessPayload<ExtArgs>
        fields: Prisma.BusinessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findFirst: {
            args: Prisma.BusinessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findMany: {
            args: Prisma.BusinessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          create: {
            args: Prisma.BusinessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          createMany: {
            args: Prisma.BusinessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BusinessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          delete: {
            args: Prisma.BusinessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          update: {
            args: Prisma.BusinessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          deleteMany: {
            args: Prisma.BusinessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BusinessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          aggregate: {
            args: Prisma.BusinessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusiness>
          }
          groupBy: {
            args: Prisma.BusinessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessCountAggregateOutputType> | number
          }
        }
      }
      Staff: {
        payload: Prisma.$StaffPayload<ExtArgs>
        fields: Prisma.StaffFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StaffFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StaffFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          findFirst: {
            args: Prisma.StaffFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StaffFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          findMany: {
            args: Prisma.StaffFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>[]
          }
          create: {
            args: Prisma.StaffCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          createMany: {
            args: Prisma.StaffCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StaffCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>[]
          }
          delete: {
            args: Prisma.StaffDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          update: {
            args: Prisma.StaffUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          deleteMany: {
            args: Prisma.StaffDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StaffUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StaffUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StaffPayload>
          }
          aggregate: {
            args: Prisma.StaffAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStaff>
          }
          groupBy: {
            args: Prisma.StaffGroupByArgs<ExtArgs>
            result: $Utils.Optional<StaffGroupByOutputType>[]
          }
          count: {
            args: Prisma.StaffCountArgs<ExtArgs>
            result: $Utils.Optional<StaffCountAggregateOutputType> | number
          }
        }
      }
      ServiceCategory: {
        payload: Prisma.$ServiceCategoryPayload<ExtArgs>
        fields: Prisma.ServiceCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          findFirst: {
            args: Prisma.ServiceCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          findMany: {
            args: Prisma.ServiceCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>[]
          }
          create: {
            args: Prisma.ServiceCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          createMany: {
            args: Prisma.ServiceCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>[]
          }
          delete: {
            args: Prisma.ServiceCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          update: {
            args: Prisma.ServiceCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          deleteMany: {
            args: Prisma.ServiceCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServiceCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServiceCategoryPayload>
          }
          aggregate: {
            args: Prisma.ServiceCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServiceCategory>
          }
          groupBy: {
            args: Prisma.ServiceCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceCategoryCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      ClientSensitiveInfo: {
        payload: Prisma.$ClientSensitiveInfoPayload<ExtArgs>
        fields: Prisma.ClientSensitiveInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientSensitiveInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientSensitiveInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          findFirst: {
            args: Prisma.ClientSensitiveInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientSensitiveInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          findMany: {
            args: Prisma.ClientSensitiveInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>[]
          }
          create: {
            args: Prisma.ClientSensitiveInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          createMany: {
            args: Prisma.ClientSensitiveInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientSensitiveInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>[]
          }
          delete: {
            args: Prisma.ClientSensitiveInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          update: {
            args: Prisma.ClientSensitiveInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          deleteMany: {
            args: Prisma.ClientSensitiveInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientSensitiveInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientSensitiveInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientSensitiveInfoPayload>
          }
          aggregate: {
            args: Prisma.ClientSensitiveInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClientSensitiveInfo>
          }
          groupBy: {
            args: Prisma.ClientSensitiveInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientSensitiveInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientSensitiveInfoCountArgs<ExtArgs>
            result: $Utils.Optional<ClientSensitiveInfoCountAggregateOutputType> | number
          }
        }
      }
      Service: {
        payload: Prisma.$ServicePayload<ExtArgs>
        fields: Prisma.ServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findFirst: {
            args: Prisma.ServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findMany: {
            args: Prisma.ServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          create: {
            args: Prisma.ServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          createMany: {
            args: Prisma.ServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          delete: {
            args: Prisma.ServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          update: {
            args: Prisma.ServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          deleteMany: {
            args: Prisma.ServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          aggregate: {
            args: Prisma.ServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateService>
          }
          groupBy: {
            args: Prisma.ServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Schedule: {
        payload: Prisma.$SchedulePayload<ExtArgs>
        fields: Prisma.ScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findFirst: {
            args: Prisma.ScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findMany: {
            args: Prisma.ScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          create: {
            args: Prisma.ScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          createMany: {
            args: Prisma.ScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          delete: {
            args: Prisma.ScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          update: {
            args: Prisma.ScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          deleteMany: {
            args: Prisma.ScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          aggregate: {
            args: Prisma.ScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchedule>
          }
          groupBy: {
            args: Prisma.ScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCountAggregateOutputType> | number
          }
        }
      }
      BusinessHours: {
        payload: Prisma.$BusinessHoursPayload<ExtArgs>
        fields: Prisma.BusinessHoursFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessHoursFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessHoursFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          findFirst: {
            args: Prisma.BusinessHoursFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessHoursFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          findMany: {
            args: Prisma.BusinessHoursFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>[]
          }
          create: {
            args: Prisma.BusinessHoursCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          createMany: {
            args: Prisma.BusinessHoursCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BusinessHoursCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>[]
          }
          delete: {
            args: Prisma.BusinessHoursDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          update: {
            args: Prisma.BusinessHoursUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          deleteMany: {
            args: Prisma.BusinessHoursDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessHoursUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BusinessHoursUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessHoursPayload>
          }
          aggregate: {
            args: Prisma.BusinessHoursAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusinessHours>
          }
          groupBy: {
            args: Prisma.BusinessHoursGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessHoursGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessHoursCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessHoursCountAggregateOutputType> | number
          }
        }
      }
      ClientRelationship: {
        payload: Prisma.$ClientRelationshipPayload<ExtArgs>
        fields: Prisma.ClientRelationshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientRelationshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientRelationshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          findFirst: {
            args: Prisma.ClientRelationshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientRelationshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          findMany: {
            args: Prisma.ClientRelationshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>[]
          }
          create: {
            args: Prisma.ClientRelationshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          createMany: {
            args: Prisma.ClientRelationshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientRelationshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>[]
          }
          delete: {
            args: Prisma.ClientRelationshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          update: {
            args: Prisma.ClientRelationshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          deleteMany: {
            args: Prisma.ClientRelationshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientRelationshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ClientRelationshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientRelationshipPayload>
          }
          aggregate: {
            args: Prisma.ClientRelationshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClientRelationship>
          }
          groupBy: {
            args: Prisma.ClientRelationshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientRelationshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientRelationshipCountArgs<ExtArgs>
            result: $Utils.Optional<ClientRelationshipCountAggregateOutputType> | number
          }
        }
      }
      VisitHistory: {
        payload: Prisma.$VisitHistoryPayload<ExtArgs>
        fields: Prisma.VisitHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VisitHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VisitHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          findFirst: {
            args: Prisma.VisitHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VisitHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          findMany: {
            args: Prisma.VisitHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>[]
          }
          create: {
            args: Prisma.VisitHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          createMany: {
            args: Prisma.VisitHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VisitHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>[]
          }
          delete: {
            args: Prisma.VisitHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          update: {
            args: Prisma.VisitHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          deleteMany: {
            args: Prisma.VisitHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VisitHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VisitHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VisitHistoryPayload>
          }
          aggregate: {
            args: Prisma.VisitHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVisitHistory>
          }
          groupBy: {
            args: Prisma.VisitHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<VisitHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.VisitHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<VisitHistoryCountAggregateOutputType> | number
          }
        }
      }
      RelationshipNote: {
        payload: Prisma.$RelationshipNotePayload<ExtArgs>
        fields: Prisma.RelationshipNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RelationshipNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RelationshipNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          findFirst: {
            args: Prisma.RelationshipNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RelationshipNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          findMany: {
            args: Prisma.RelationshipNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>[]
          }
          create: {
            args: Prisma.RelationshipNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          createMany: {
            args: Prisma.RelationshipNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RelationshipNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>[]
          }
          delete: {
            args: Prisma.RelationshipNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          update: {
            args: Prisma.RelationshipNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          deleteMany: {
            args: Prisma.RelationshipNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RelationshipNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RelationshipNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RelationshipNotePayload>
          }
          aggregate: {
            args: Prisma.RelationshipNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRelationshipNote>
          }
          groupBy: {
            args: Prisma.RelationshipNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<RelationshipNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.RelationshipNoteCountArgs<ExtArgs>
            result: $Utils.Optional<RelationshipNoteCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
   * Count Type BusinessCountOutputType
   */

  export type BusinessCountOutputType = {
    appointments: number
    businessHours: number
    clientRelationships: number
    clients: number
    categories: number
    services: number
    staff: number
  }

  export type BusinessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | BusinessCountOutputTypeCountAppointmentsArgs
    businessHours?: boolean | BusinessCountOutputTypeCountBusinessHoursArgs
    clientRelationships?: boolean | BusinessCountOutputTypeCountClientRelationshipsArgs
    clients?: boolean | BusinessCountOutputTypeCountClientsArgs
    categories?: boolean | BusinessCountOutputTypeCountCategoriesArgs
    services?: boolean | BusinessCountOutputTypeCountServicesArgs
    staff?: boolean | BusinessCountOutputTypeCountStaffArgs
  }

  // Custom InputTypes
  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessCountOutputType
     */
    select?: BusinessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountBusinessHoursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessHoursWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountClientRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientRelationshipWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceCategoryWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountStaffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
  }


  /**
   * Count Type StaffCountOutputType
   */

  export type StaffCountOutputType = {
    appointments: number
    relationshipNotes: number
    schedules: number
    preferredByClients: number
    services: number
  }

  export type StaffCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | StaffCountOutputTypeCountAppointmentsArgs
    relationshipNotes?: boolean | StaffCountOutputTypeCountRelationshipNotesArgs
    schedules?: boolean | StaffCountOutputTypeCountSchedulesArgs
    preferredByClients?: boolean | StaffCountOutputTypeCountPreferredByClientsArgs
    services?: boolean | StaffCountOutputTypeCountServicesArgs
  }

  // Custom InputTypes
  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StaffCountOutputType
     */
    select?: StaffCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeCountRelationshipNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelationshipNoteWhereInput
  }

  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeCountSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
  }

  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeCountPreferredByClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientRelationshipWhereInput
  }

  /**
   * StaffCountOutputType without action
   */
  export type StaffCountOutputTypeCountServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
  }


  /**
   * Count Type ServiceCategoryCountOutputType
   */

  export type ServiceCategoryCountOutputType = {
    services: number
  }

  export type ServiceCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    services?: boolean | ServiceCategoryCountOutputTypeCountServicesArgs
  }

  // Custom InputTypes
  /**
   * ServiceCategoryCountOutputType without action
   */
  export type ServiceCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategoryCountOutputType
     */
    select?: ServiceCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServiceCategoryCountOutputType without action
   */
  export type ServiceCategoryCountOutputTypeCountServicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    appointments: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | ClientCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Count Type ServiceCountOutputType
   */

  export type ServiceCountOutputType = {
    appointments: number
    providers: number
  }

  export type ServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | ServiceCountOutputTypeCountAppointmentsArgs
    providers?: boolean | ServiceCountOutputTypeCountProvidersArgs
  }

  // Custom InputTypes
  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCountOutputType
     */
    select?: ServiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountProvidersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
  }


  /**
   * Count Type ClientRelationshipCountOutputType
   */

  export type ClientRelationshipCountOutputType = {
    noteHistory: number
    visitHistory: number
    preferredStaff: number
  }

  export type ClientRelationshipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    noteHistory?: boolean | ClientRelationshipCountOutputTypeCountNoteHistoryArgs
    visitHistory?: boolean | ClientRelationshipCountOutputTypeCountVisitHistoryArgs
    preferredStaff?: boolean | ClientRelationshipCountOutputTypeCountPreferredStaffArgs
  }

  // Custom InputTypes
  /**
   * ClientRelationshipCountOutputType without action
   */
  export type ClientRelationshipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationshipCountOutputType
     */
    select?: ClientRelationshipCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientRelationshipCountOutputType without action
   */
  export type ClientRelationshipCountOutputTypeCountNoteHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelationshipNoteWhereInput
  }

  /**
   * ClientRelationshipCountOutputType without action
   */
  export type ClientRelationshipCountOutputTypeCountVisitHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitHistoryWhereInput
  }

  /**
   * ClientRelationshipCountOutputType without action
   */
  export type ClientRelationshipCountOutputTypeCountPreferredStaffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Business
   */

  export type AggregateBusiness = {
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  export type BusinessMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.BusinessType | null
    createdAt: Date | null
    updatedAt: Date | null
    address: string | null
    phone: string | null
    email: string | null
  }

  export type BusinessMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.BusinessType | null
    createdAt: Date | null
    updatedAt: Date | null
    address: string | null
    phone: string | null
    email: string | null
  }

  export type BusinessCountAggregateOutputType = {
    id: number
    name: number
    type: number
    createdAt: number
    updatedAt: number
    address: number
    phone: number
    email: number
    settings: number
    _all: number
  }


  export type BusinessMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    address?: true
    phone?: true
    email?: true
  }

  export type BusinessMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    address?: true
    phone?: true
    email?: true
  }

  export type BusinessCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    createdAt?: true
    updatedAt?: true
    address?: true
    phone?: true
    email?: true
    settings?: true
    _all?: true
  }

  export type BusinessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Business to aggregate.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Businesses
    **/
    _count?: true | BusinessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessMaxAggregateInputType
  }

  export type GetBusinessAggregateType<T extends BusinessAggregateArgs> = {
        [P in keyof T & keyof AggregateBusiness]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusiness[P]>
      : GetScalarType<T[P], AggregateBusiness[P]>
  }




  export type BusinessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithAggregationInput | BusinessOrderByWithAggregationInput[]
    by: BusinessScalarFieldEnum[] | BusinessScalarFieldEnum
    having?: BusinessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessCountAggregateInputType | true
    _min?: BusinessMinAggregateInputType
    _max?: BusinessMaxAggregateInputType
  }

  export type BusinessGroupByOutputType = {
    id: string
    name: string
    type: $Enums.BusinessType
    createdAt: Date
    updatedAt: Date
    address: string | null
    phone: string | null
    email: string
    settings: JsonValue | null
    _count: BusinessCountAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  type GetBusinessGroupByPayload<T extends BusinessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessGroupByOutputType[P]>
        }
      >
    >


  export type BusinessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    settings?: boolean
    appointments?: boolean | Business$appointmentsArgs<ExtArgs>
    businessHours?: boolean | Business$businessHoursArgs<ExtArgs>
    clientRelationships?: boolean | Business$clientRelationshipsArgs<ExtArgs>
    clients?: boolean | Business$clientsArgs<ExtArgs>
    categories?: boolean | Business$categoriesArgs<ExtArgs>
    services?: boolean | Business$servicesArgs<ExtArgs>
    staff?: boolean | Business$staffArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    settings?: boolean
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    address?: boolean
    phone?: boolean
    email?: boolean
    settings?: boolean
  }

  export type BusinessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Business$appointmentsArgs<ExtArgs>
    businessHours?: boolean | Business$businessHoursArgs<ExtArgs>
    clientRelationships?: boolean | Business$clientRelationshipsArgs<ExtArgs>
    clients?: boolean | Business$clientsArgs<ExtArgs>
    categories?: boolean | Business$categoriesArgs<ExtArgs>
    services?: boolean | Business$servicesArgs<ExtArgs>
    staff?: boolean | Business$staffArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BusinessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BusinessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Business"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      businessHours: Prisma.$BusinessHoursPayload<ExtArgs>[]
      clientRelationships: Prisma.$ClientRelationshipPayload<ExtArgs>[]
      clients: Prisma.$ClientPayload<ExtArgs>[]
      categories: Prisma.$ServiceCategoryPayload<ExtArgs>[]
      services: Prisma.$ServicePayload<ExtArgs>[]
      staff: Prisma.$StaffPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.BusinessType
      createdAt: Date
      updatedAt: Date
      address: string | null
      phone: string | null
      email: string
      settings: Prisma.JsonValue | null
    }, ExtArgs["result"]["business"]>
    composites: {}
  }

  type BusinessGetPayload<S extends boolean | null | undefined | BusinessDefaultArgs> = $Result.GetResult<Prisma.$BusinessPayload, S>

  type BusinessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BusinessFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BusinessCountAggregateInputType | true
    }

  export interface BusinessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Business'], meta: { name: 'Business' } }
    /**
     * Find zero or one Business that matches the filter.
     * @param {BusinessFindUniqueArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessFindUniqueArgs>(args: SelectSubset<T, BusinessFindUniqueArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Business that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BusinessFindUniqueOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Business that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessFindFirstArgs>(args?: SelectSubset<T, BusinessFindFirstArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Business that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Businesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Businesses
     * const businesses = await prisma.business.findMany()
     * 
     * // Get first 10 Businesses
     * const businesses = await prisma.business.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessWithIdOnly = await prisma.business.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessFindManyArgs>(args?: SelectSubset<T, BusinessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Business.
     * @param {BusinessCreateArgs} args - Arguments to create a Business.
     * @example
     * // Create one Business
     * const Business = await prisma.business.create({
     *   data: {
     *     // ... data to create a Business
     *   }
     * })
     * 
     */
    create<T extends BusinessCreateArgs>(args: SelectSubset<T, BusinessCreateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Businesses.
     * @param {BusinessCreateManyArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessCreateManyArgs>(args?: SelectSubset<T, BusinessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Businesses and returns the data saved in the database.
     * @param {BusinessCreateManyAndReturnArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Businesses and only return the `id`
     * const businessWithIdOnly = await prisma.business.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BusinessCreateManyAndReturnArgs>(args?: SelectSubset<T, BusinessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Business.
     * @param {BusinessDeleteArgs} args - Arguments to delete one Business.
     * @example
     * // Delete one Business
     * const Business = await prisma.business.delete({
     *   where: {
     *     // ... filter to delete one Business
     *   }
     * })
     * 
     */
    delete<T extends BusinessDeleteArgs>(args: SelectSubset<T, BusinessDeleteArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Business.
     * @param {BusinessUpdateArgs} args - Arguments to update one Business.
     * @example
     * // Update one Business
     * const business = await prisma.business.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessUpdateArgs>(args: SelectSubset<T, BusinessUpdateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Businesses.
     * @param {BusinessDeleteManyArgs} args - Arguments to filter Businesses to delete.
     * @example
     * // Delete a few Businesses
     * const { count } = await prisma.business.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessDeleteManyArgs>(args?: SelectSubset<T, BusinessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessUpdateManyArgs>(args: SelectSubset<T, BusinessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Business.
     * @param {BusinessUpsertArgs} args - Arguments to update or create a Business.
     * @example
     * // Update or create a Business
     * const business = await prisma.business.upsert({
     *   create: {
     *     // ... data to create a Business
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Business we want to update
     *   }
     * })
     */
    upsert<T extends BusinessUpsertArgs>(args: SelectSubset<T, BusinessUpsertArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessCountArgs} args - Arguments to filter Businesses to count.
     * @example
     * // Count the number of Businesses
     * const count = await prisma.business.count({
     *   where: {
     *     // ... the filter for the Businesses we want to count
     *   }
     * })
    **/
    count<T extends BusinessCountArgs>(
      args?: Subset<T, BusinessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BusinessAggregateArgs>(args: Subset<T, BusinessAggregateArgs>): Prisma.PrismaPromise<GetBusinessAggregateType<T>>

    /**
     * Group by Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessGroupByArgs} args - Group by arguments.
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
      T extends BusinessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessGroupByArgs['orderBy'] }
        : { orderBy?: BusinessGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BusinessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Business model
   */
  readonly fields: BusinessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Business.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Business$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Business$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    businessHours<T extends Business$businessHoursArgs<ExtArgs> = {}>(args?: Subset<T, Business$businessHoursArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findMany"> | Null>
    clientRelationships<T extends Business$clientRelationshipsArgs<ExtArgs> = {}>(args?: Subset<T, Business$clientRelationshipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findMany"> | Null>
    clients<T extends Business$clientsArgs<ExtArgs> = {}>(args?: Subset<T, Business$clientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany"> | Null>
    categories<T extends Business$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, Business$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findMany"> | Null>
    services<T extends Business$servicesArgs<ExtArgs> = {}>(args?: Subset<T, Business$servicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany"> | Null>
    staff<T extends Business$staffArgs<ExtArgs> = {}>(args?: Subset<T, Business$staffArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Business model
   */ 
  interface BusinessFieldRefs {
    readonly id: FieldRef<"Business", 'String'>
    readonly name: FieldRef<"Business", 'String'>
    readonly type: FieldRef<"Business", 'BusinessType'>
    readonly createdAt: FieldRef<"Business", 'DateTime'>
    readonly updatedAt: FieldRef<"Business", 'DateTime'>
    readonly address: FieldRef<"Business", 'String'>
    readonly phone: FieldRef<"Business", 'String'>
    readonly email: FieldRef<"Business", 'String'>
    readonly settings: FieldRef<"Business", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Business findUnique
   */
  export type BusinessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findUniqueOrThrow
   */
  export type BusinessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findFirst
   */
  export type BusinessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findFirstOrThrow
   */
  export type BusinessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findMany
   */
  export type BusinessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Businesses to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business create
   */
  export type BusinessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to create a Business.
     */
    data: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
  }

  /**
   * Business createMany
   */
  export type BusinessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Business createManyAndReturn
   */
  export type BusinessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Business update
   */
  export type BusinessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to update a Business.
     */
    data: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
    /**
     * Choose, which Business to update.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business updateMany
   */
  export type BusinessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Businesses.
     */
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyInput>
    /**
     * Filter which Businesses to update
     */
    where?: BusinessWhereInput
  }

  /**
   * Business upsert
   */
  export type BusinessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The filter to search for the Business to update in case it exists.
     */
    where: BusinessWhereUniqueInput
    /**
     * In case the Business found by the `where` argument doesn't exist, create a new Business with this data.
     */
    create: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
    /**
     * In case the Business was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
  }

  /**
   * Business delete
   */
  export type BusinessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter which Business to delete.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business deleteMany
   */
  export type BusinessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Businesses to delete
     */
    where?: BusinessWhereInput
  }

  /**
   * Business.appointments
   */
  export type Business$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Business.businessHours
   */
  export type Business$businessHoursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    where?: BusinessHoursWhereInput
    orderBy?: BusinessHoursOrderByWithRelationInput | BusinessHoursOrderByWithRelationInput[]
    cursor?: BusinessHoursWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BusinessHoursScalarFieldEnum | BusinessHoursScalarFieldEnum[]
  }

  /**
   * Business.clientRelationships
   */
  export type Business$clientRelationshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    where?: ClientRelationshipWhereInput
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    cursor?: ClientRelationshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientRelationshipScalarFieldEnum | ClientRelationshipScalarFieldEnum[]
  }

  /**
   * Business.clients
   */
  export type Business$clientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Business.categories
   */
  export type Business$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    where?: ServiceCategoryWhereInput
    orderBy?: ServiceCategoryOrderByWithRelationInput | ServiceCategoryOrderByWithRelationInput[]
    cursor?: ServiceCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceCategoryScalarFieldEnum | ServiceCategoryScalarFieldEnum[]
  }

  /**
   * Business.services
   */
  export type Business$servicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    cursor?: ServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Business.staff
   */
  export type Business$staffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    cursor?: StaffWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Business without action
   */
  export type BusinessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
  }


  /**
   * Model Staff
   */

  export type AggregateStaff = {
    _count: StaffCountAggregateOutputType | null
    _min: StaffMinAggregateOutputType | null
    _max: StaffMaxAggregateOutputType | null
  }

  export type StaffMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: $Enums.StaffRole | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type StaffMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: $Enums.StaffRole | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type StaffCountAggregateOutputType = {
    id: number
    email: number
    name: number
    role: number
    createdAt: number
    updatedAt: number
    businessId: number
    _all: number
  }


  export type StaffMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type StaffMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type StaffCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    _all?: true
  }

  export type StaffAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Staff to aggregate.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Staff
    **/
    _count?: true | StaffCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StaffMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StaffMaxAggregateInputType
  }

  export type GetStaffAggregateType<T extends StaffAggregateArgs> = {
        [P in keyof T & keyof AggregateStaff]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStaff[P]>
      : GetScalarType<T[P], AggregateStaff[P]>
  }




  export type StaffGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithAggregationInput | StaffOrderByWithAggregationInput[]
    by: StaffScalarFieldEnum[] | StaffScalarFieldEnum
    having?: StaffScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StaffCountAggregateInputType | true
    _min?: StaffMinAggregateInputType
    _max?: StaffMaxAggregateInputType
  }

  export type StaffGroupByOutputType = {
    id: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt: Date
    updatedAt: Date
    businessId: string
    _count: StaffCountAggregateOutputType | null
    _min: StaffMinAggregateOutputType | null
    _max: StaffMaxAggregateOutputType | null
  }

  type GetStaffGroupByPayload<T extends StaffGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StaffGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StaffGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StaffGroupByOutputType[P]>
            : GetScalarType<T[P], StaffGroupByOutputType[P]>
        }
      >
    >


  export type StaffSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    appointments?: boolean | Staff$appointmentsArgs<ExtArgs>
    relationshipNotes?: boolean | Staff$relationshipNotesArgs<ExtArgs>
    schedules?: boolean | Staff$schedulesArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    preferredByClients?: boolean | Staff$preferredByClientsArgs<ExtArgs>
    services?: boolean | Staff$servicesArgs<ExtArgs>
    _count?: boolean | StaffCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["staff"]>

  export type StaffSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["staff"]>

  export type StaffSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
  }

  export type StaffInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Staff$appointmentsArgs<ExtArgs>
    relationshipNotes?: boolean | Staff$relationshipNotesArgs<ExtArgs>
    schedules?: boolean | Staff$schedulesArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    preferredByClients?: boolean | Staff$preferredByClientsArgs<ExtArgs>
    services?: boolean | Staff$servicesArgs<ExtArgs>
    _count?: boolean | StaffCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StaffIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $StaffPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Staff"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      relationshipNotes: Prisma.$RelationshipNotePayload<ExtArgs>[]
      schedules: Prisma.$SchedulePayload<ExtArgs>[]
      business: Prisma.$BusinessPayload<ExtArgs>
      preferredByClients: Prisma.$ClientRelationshipPayload<ExtArgs>[]
      services: Prisma.$ServicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      role: $Enums.StaffRole
      createdAt: Date
      updatedAt: Date
      businessId: string
    }, ExtArgs["result"]["staff"]>
    composites: {}
  }

  type StaffGetPayload<S extends boolean | null | undefined | StaffDefaultArgs> = $Result.GetResult<Prisma.$StaffPayload, S>

  type StaffCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StaffFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StaffCountAggregateInputType | true
    }

  export interface StaffDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Staff'], meta: { name: 'Staff' } }
    /**
     * Find zero or one Staff that matches the filter.
     * @param {StaffFindUniqueArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StaffFindUniqueArgs>(args: SelectSubset<T, StaffFindUniqueArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Staff that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StaffFindUniqueOrThrowArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StaffFindUniqueOrThrowArgs>(args: SelectSubset<T, StaffFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Staff that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindFirstArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StaffFindFirstArgs>(args?: SelectSubset<T, StaffFindFirstArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Staff that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindFirstOrThrowArgs} args - Arguments to find a Staff
     * @example
     * // Get one Staff
     * const staff = await prisma.staff.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StaffFindFirstOrThrowArgs>(args?: SelectSubset<T, StaffFindFirstOrThrowArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Staff that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Staff
     * const staff = await prisma.staff.findMany()
     * 
     * // Get first 10 Staff
     * const staff = await prisma.staff.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const staffWithIdOnly = await prisma.staff.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StaffFindManyArgs>(args?: SelectSubset<T, StaffFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Staff.
     * @param {StaffCreateArgs} args - Arguments to create a Staff.
     * @example
     * // Create one Staff
     * const Staff = await prisma.staff.create({
     *   data: {
     *     // ... data to create a Staff
     *   }
     * })
     * 
     */
    create<T extends StaffCreateArgs>(args: SelectSubset<T, StaffCreateArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Staff.
     * @param {StaffCreateManyArgs} args - Arguments to create many Staff.
     * @example
     * // Create many Staff
     * const staff = await prisma.staff.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StaffCreateManyArgs>(args?: SelectSubset<T, StaffCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Staff and returns the data saved in the database.
     * @param {StaffCreateManyAndReturnArgs} args - Arguments to create many Staff.
     * @example
     * // Create many Staff
     * const staff = await prisma.staff.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Staff and only return the `id`
     * const staffWithIdOnly = await prisma.staff.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StaffCreateManyAndReturnArgs>(args?: SelectSubset<T, StaffCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Staff.
     * @param {StaffDeleteArgs} args - Arguments to delete one Staff.
     * @example
     * // Delete one Staff
     * const Staff = await prisma.staff.delete({
     *   where: {
     *     // ... filter to delete one Staff
     *   }
     * })
     * 
     */
    delete<T extends StaffDeleteArgs>(args: SelectSubset<T, StaffDeleteArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Staff.
     * @param {StaffUpdateArgs} args - Arguments to update one Staff.
     * @example
     * // Update one Staff
     * const staff = await prisma.staff.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StaffUpdateArgs>(args: SelectSubset<T, StaffUpdateArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Staff.
     * @param {StaffDeleteManyArgs} args - Arguments to filter Staff to delete.
     * @example
     * // Delete a few Staff
     * const { count } = await prisma.staff.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StaffDeleteManyArgs>(args?: SelectSubset<T, StaffDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Staff
     * const staff = await prisma.staff.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StaffUpdateManyArgs>(args: SelectSubset<T, StaffUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Staff.
     * @param {StaffUpsertArgs} args - Arguments to update or create a Staff.
     * @example
     * // Update or create a Staff
     * const staff = await prisma.staff.upsert({
     *   create: {
     *     // ... data to create a Staff
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Staff we want to update
     *   }
     * })
     */
    upsert<T extends StaffUpsertArgs>(args: SelectSubset<T, StaffUpsertArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffCountArgs} args - Arguments to filter Staff to count.
     * @example
     * // Count the number of Staff
     * const count = await prisma.staff.count({
     *   where: {
     *     // ... the filter for the Staff we want to count
     *   }
     * })
    **/
    count<T extends StaffCountArgs>(
      args?: Subset<T, StaffCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StaffCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StaffAggregateArgs>(args: Subset<T, StaffAggregateArgs>): Prisma.PrismaPromise<GetStaffAggregateType<T>>

    /**
     * Group by Staff.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StaffGroupByArgs} args - Group by arguments.
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
      T extends StaffGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StaffGroupByArgs['orderBy'] }
        : { orderBy?: StaffGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StaffGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStaffGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Staff model
   */
  readonly fields: StaffFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Staff.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StaffClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Staff$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Staff$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    relationshipNotes<T extends Staff$relationshipNotesArgs<ExtArgs> = {}>(args?: Subset<T, Staff$relationshipNotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findMany"> | Null>
    schedules<T extends Staff$schedulesArgs<ExtArgs> = {}>(args?: Subset<T, Staff$schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany"> | Null>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    preferredByClients<T extends Staff$preferredByClientsArgs<ExtArgs> = {}>(args?: Subset<T, Staff$preferredByClientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findMany"> | Null>
    services<T extends Staff$servicesArgs<ExtArgs> = {}>(args?: Subset<T, Staff$servicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Staff model
   */ 
  interface StaffFieldRefs {
    readonly id: FieldRef<"Staff", 'String'>
    readonly email: FieldRef<"Staff", 'String'>
    readonly name: FieldRef<"Staff", 'String'>
    readonly role: FieldRef<"Staff", 'StaffRole'>
    readonly createdAt: FieldRef<"Staff", 'DateTime'>
    readonly updatedAt: FieldRef<"Staff", 'DateTime'>
    readonly businessId: FieldRef<"Staff", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Staff findUnique
   */
  export type StaffFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff findUniqueOrThrow
   */
  export type StaffFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff findFirst
   */
  export type StaffFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Staff.
     */
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff findFirstOrThrow
   */
  export type StaffFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Staff.
     */
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff findMany
   */
  export type StaffFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter, which Staff to fetch.
     */
    where?: StaffWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Staff to fetch.
     */
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Staff.
     */
    cursor?: StaffWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Staff from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Staff.
     */
    skip?: number
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Staff create
   */
  export type StaffCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The data needed to create a Staff.
     */
    data: XOR<StaffCreateInput, StaffUncheckedCreateInput>
  }

  /**
   * Staff createMany
   */
  export type StaffCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Staff.
     */
    data: StaffCreateManyInput | StaffCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Staff createManyAndReturn
   */
  export type StaffCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Staff.
     */
    data: StaffCreateManyInput | StaffCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Staff update
   */
  export type StaffUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The data needed to update a Staff.
     */
    data: XOR<StaffUpdateInput, StaffUncheckedUpdateInput>
    /**
     * Choose, which Staff to update.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff updateMany
   */
  export type StaffUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Staff.
     */
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyInput>
    /**
     * Filter which Staff to update
     */
    where?: StaffWhereInput
  }

  /**
   * Staff upsert
   */
  export type StaffUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * The filter to search for the Staff to update in case it exists.
     */
    where: StaffWhereUniqueInput
    /**
     * In case the Staff found by the `where` argument doesn't exist, create a new Staff with this data.
     */
    create: XOR<StaffCreateInput, StaffUncheckedCreateInput>
    /**
     * In case the Staff was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StaffUpdateInput, StaffUncheckedUpdateInput>
  }

  /**
   * Staff delete
   */
  export type StaffDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    /**
     * Filter which Staff to delete.
     */
    where: StaffWhereUniqueInput
  }

  /**
   * Staff deleteMany
   */
  export type StaffDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Staff to delete
     */
    where?: StaffWhereInput
  }

  /**
   * Staff.appointments
   */
  export type Staff$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Staff.relationshipNotes
   */
  export type Staff$relationshipNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    where?: RelationshipNoteWhereInput
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    cursor?: RelationshipNoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelationshipNoteScalarFieldEnum | RelationshipNoteScalarFieldEnum[]
  }

  /**
   * Staff.schedules
   */
  export type Staff$schedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    cursor?: ScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Staff.preferredByClients
   */
  export type Staff$preferredByClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    where?: ClientRelationshipWhereInput
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    cursor?: ClientRelationshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientRelationshipScalarFieldEnum | ClientRelationshipScalarFieldEnum[]
  }

  /**
   * Staff.services
   */
  export type Staff$servicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    cursor?: ServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Staff without action
   */
  export type StaffDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
  }


  /**
   * Model ServiceCategory
   */

  export type AggregateServiceCategory = {
    _count: ServiceCategoryCountAggregateOutputType | null
    _min: ServiceCategoryMinAggregateOutputType | null
    _max: ServiceCategoryMaxAggregateOutputType | null
  }

  export type ServiceCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type ServiceCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    color: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type ServiceCategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    color: number
    createdAt: number
    updatedAt: number
    businessId: number
    _all: number
  }


  export type ServiceCategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type ServiceCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type ServiceCategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    color?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    _all?: true
  }

  export type ServiceCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceCategory to aggregate.
     */
    where?: ServiceCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceCategories to fetch.
     */
    orderBy?: ServiceCategoryOrderByWithRelationInput | ServiceCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServiceCategories
    **/
    _count?: true | ServiceCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceCategoryMaxAggregateInputType
  }

  export type GetServiceCategoryAggregateType<T extends ServiceCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateServiceCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServiceCategory[P]>
      : GetScalarType<T[P], AggregateServiceCategory[P]>
  }




  export type ServiceCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceCategoryWhereInput
    orderBy?: ServiceCategoryOrderByWithAggregationInput | ServiceCategoryOrderByWithAggregationInput[]
    by: ServiceCategoryScalarFieldEnum[] | ServiceCategoryScalarFieldEnum
    having?: ServiceCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceCategoryCountAggregateInputType | true
    _min?: ServiceCategoryMinAggregateInputType
    _max?: ServiceCategoryMaxAggregateInputType
  }

  export type ServiceCategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
    businessId: string
    _count: ServiceCategoryCountAggregateOutputType | null
    _min: ServiceCategoryMinAggregateOutputType | null
    _max: ServiceCategoryMaxAggregateOutputType | null
  }

  type GetServiceCategoryGroupByPayload<T extends ServiceCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceCategoryGroupByOutputType[P]>
        }
      >
    >


  export type ServiceCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    services?: boolean | ServiceCategory$servicesArgs<ExtArgs>
    _count?: boolean | ServiceCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceCategory"]>

  export type ServiceCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["serviceCategory"]>

  export type ServiceCategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    color?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
  }

  export type ServiceCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    services?: boolean | ServiceCategory$servicesArgs<ExtArgs>
    _count?: boolean | ServiceCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $ServiceCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServiceCategory"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      services: Prisma.$ServicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      color: string | null
      createdAt: Date
      updatedAt: Date
      businessId: string
    }, ExtArgs["result"]["serviceCategory"]>
    composites: {}
  }

  type ServiceCategoryGetPayload<S extends boolean | null | undefined | ServiceCategoryDefaultArgs> = $Result.GetResult<Prisma.$ServiceCategoryPayload, S>

  type ServiceCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ServiceCategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ServiceCategoryCountAggregateInputType | true
    }

  export interface ServiceCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServiceCategory'], meta: { name: 'ServiceCategory' } }
    /**
     * Find zero or one ServiceCategory that matches the filter.
     * @param {ServiceCategoryFindUniqueArgs} args - Arguments to find a ServiceCategory
     * @example
     * // Get one ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceCategoryFindUniqueArgs>(args: SelectSubset<T, ServiceCategoryFindUniqueArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ServiceCategory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ServiceCategoryFindUniqueOrThrowArgs} args - Arguments to find a ServiceCategory
     * @example
     * // Get one ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ServiceCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryFindFirstArgs} args - Arguments to find a ServiceCategory
     * @example
     * // Get one ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceCategoryFindFirstArgs>(args?: SelectSubset<T, ServiceCategoryFindFirstArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ServiceCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryFindFirstOrThrowArgs} args - Arguments to find a ServiceCategory
     * @example
     * // Get one ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ServiceCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServiceCategories
     * const serviceCategories = await prisma.serviceCategory.findMany()
     * 
     * // Get first 10 ServiceCategories
     * const serviceCategories = await prisma.serviceCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceCategoryWithIdOnly = await prisma.serviceCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceCategoryFindManyArgs>(args?: SelectSubset<T, ServiceCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ServiceCategory.
     * @param {ServiceCategoryCreateArgs} args - Arguments to create a ServiceCategory.
     * @example
     * // Create one ServiceCategory
     * const ServiceCategory = await prisma.serviceCategory.create({
     *   data: {
     *     // ... data to create a ServiceCategory
     *   }
     * })
     * 
     */
    create<T extends ServiceCategoryCreateArgs>(args: SelectSubset<T, ServiceCategoryCreateArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ServiceCategories.
     * @param {ServiceCategoryCreateManyArgs} args - Arguments to create many ServiceCategories.
     * @example
     * // Create many ServiceCategories
     * const serviceCategory = await prisma.serviceCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceCategoryCreateManyArgs>(args?: SelectSubset<T, ServiceCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServiceCategories and returns the data saved in the database.
     * @param {ServiceCategoryCreateManyAndReturnArgs} args - Arguments to create many ServiceCategories.
     * @example
     * // Create many ServiceCategories
     * const serviceCategory = await prisma.serviceCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServiceCategories and only return the `id`
     * const serviceCategoryWithIdOnly = await prisma.serviceCategory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ServiceCategory.
     * @param {ServiceCategoryDeleteArgs} args - Arguments to delete one ServiceCategory.
     * @example
     * // Delete one ServiceCategory
     * const ServiceCategory = await prisma.serviceCategory.delete({
     *   where: {
     *     // ... filter to delete one ServiceCategory
     *   }
     * })
     * 
     */
    delete<T extends ServiceCategoryDeleteArgs>(args: SelectSubset<T, ServiceCategoryDeleteArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ServiceCategory.
     * @param {ServiceCategoryUpdateArgs} args - Arguments to update one ServiceCategory.
     * @example
     * // Update one ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceCategoryUpdateArgs>(args: SelectSubset<T, ServiceCategoryUpdateArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ServiceCategories.
     * @param {ServiceCategoryDeleteManyArgs} args - Arguments to filter ServiceCategories to delete.
     * @example
     * // Delete a few ServiceCategories
     * const { count } = await prisma.serviceCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceCategoryDeleteManyArgs>(args?: SelectSubset<T, ServiceCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServiceCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServiceCategories
     * const serviceCategory = await prisma.serviceCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceCategoryUpdateManyArgs>(args: SelectSubset<T, ServiceCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ServiceCategory.
     * @param {ServiceCategoryUpsertArgs} args - Arguments to update or create a ServiceCategory.
     * @example
     * // Update or create a ServiceCategory
     * const serviceCategory = await prisma.serviceCategory.upsert({
     *   create: {
     *     // ... data to create a ServiceCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServiceCategory we want to update
     *   }
     * })
     */
    upsert<T extends ServiceCategoryUpsertArgs>(args: SelectSubset<T, ServiceCategoryUpsertArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ServiceCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryCountArgs} args - Arguments to filter ServiceCategories to count.
     * @example
     * // Count the number of ServiceCategories
     * const count = await prisma.serviceCategory.count({
     *   where: {
     *     // ... the filter for the ServiceCategories we want to count
     *   }
     * })
    **/
    count<T extends ServiceCategoryCountArgs>(
      args?: Subset<T, ServiceCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServiceCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServiceCategoryAggregateArgs>(args: Subset<T, ServiceCategoryAggregateArgs>): Prisma.PrismaPromise<GetServiceCategoryAggregateType<T>>

    /**
     * Group by ServiceCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCategoryGroupByArgs} args - Group by arguments.
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
      T extends ServiceCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceCategoryGroupByArgs['orderBy'] }
        : { orderBy?: ServiceCategoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ServiceCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServiceCategory model
   */
  readonly fields: ServiceCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServiceCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    services<T extends ServiceCategory$servicesArgs<ExtArgs> = {}>(args?: Subset<T, ServiceCategory$servicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ServiceCategory model
   */ 
  interface ServiceCategoryFieldRefs {
    readonly id: FieldRef<"ServiceCategory", 'String'>
    readonly name: FieldRef<"ServiceCategory", 'String'>
    readonly description: FieldRef<"ServiceCategory", 'String'>
    readonly color: FieldRef<"ServiceCategory", 'String'>
    readonly createdAt: FieldRef<"ServiceCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"ServiceCategory", 'DateTime'>
    readonly businessId: FieldRef<"ServiceCategory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ServiceCategory findUnique
   */
  export type ServiceCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ServiceCategory to fetch.
     */
    where: ServiceCategoryWhereUniqueInput
  }

  /**
   * ServiceCategory findUniqueOrThrow
   */
  export type ServiceCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ServiceCategory to fetch.
     */
    where: ServiceCategoryWhereUniqueInput
  }

  /**
   * ServiceCategory findFirst
   */
  export type ServiceCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ServiceCategory to fetch.
     */
    where?: ServiceCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceCategories to fetch.
     */
    orderBy?: ServiceCategoryOrderByWithRelationInput | ServiceCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceCategories.
     */
    cursor?: ServiceCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceCategories.
     */
    distinct?: ServiceCategoryScalarFieldEnum | ServiceCategoryScalarFieldEnum[]
  }

  /**
   * ServiceCategory findFirstOrThrow
   */
  export type ServiceCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ServiceCategory to fetch.
     */
    where?: ServiceCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceCategories to fetch.
     */
    orderBy?: ServiceCategoryOrderByWithRelationInput | ServiceCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServiceCategories.
     */
    cursor?: ServiceCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServiceCategories.
     */
    distinct?: ServiceCategoryScalarFieldEnum | ServiceCategoryScalarFieldEnum[]
  }

  /**
   * ServiceCategory findMany
   */
  export type ServiceCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter, which ServiceCategories to fetch.
     */
    where?: ServiceCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServiceCategories to fetch.
     */
    orderBy?: ServiceCategoryOrderByWithRelationInput | ServiceCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServiceCategories.
     */
    cursor?: ServiceCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServiceCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServiceCategories.
     */
    skip?: number
    distinct?: ServiceCategoryScalarFieldEnum | ServiceCategoryScalarFieldEnum[]
  }

  /**
   * ServiceCategory create
   */
  export type ServiceCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a ServiceCategory.
     */
    data: XOR<ServiceCategoryCreateInput, ServiceCategoryUncheckedCreateInput>
  }

  /**
   * ServiceCategory createMany
   */
  export type ServiceCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServiceCategories.
     */
    data: ServiceCategoryCreateManyInput | ServiceCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ServiceCategory createManyAndReturn
   */
  export type ServiceCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ServiceCategories.
     */
    data: ServiceCategoryCreateManyInput | ServiceCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ServiceCategory update
   */
  export type ServiceCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a ServiceCategory.
     */
    data: XOR<ServiceCategoryUpdateInput, ServiceCategoryUncheckedUpdateInput>
    /**
     * Choose, which ServiceCategory to update.
     */
    where: ServiceCategoryWhereUniqueInput
  }

  /**
   * ServiceCategory updateMany
   */
  export type ServiceCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServiceCategories.
     */
    data: XOR<ServiceCategoryUpdateManyMutationInput, ServiceCategoryUncheckedUpdateManyInput>
    /**
     * Filter which ServiceCategories to update
     */
    where?: ServiceCategoryWhereInput
  }

  /**
   * ServiceCategory upsert
   */
  export type ServiceCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the ServiceCategory to update in case it exists.
     */
    where: ServiceCategoryWhereUniqueInput
    /**
     * In case the ServiceCategory found by the `where` argument doesn't exist, create a new ServiceCategory with this data.
     */
    create: XOR<ServiceCategoryCreateInput, ServiceCategoryUncheckedCreateInput>
    /**
     * In case the ServiceCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceCategoryUpdateInput, ServiceCategoryUncheckedUpdateInput>
  }

  /**
   * ServiceCategory delete
   */
  export type ServiceCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    /**
     * Filter which ServiceCategory to delete.
     */
    where: ServiceCategoryWhereUniqueInput
  }

  /**
   * ServiceCategory deleteMany
   */
  export type ServiceCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServiceCategories to delete
     */
    where?: ServiceCategoryWhereInput
  }

  /**
   * ServiceCategory.services
   */
  export type ServiceCategory$servicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    cursor?: ServiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * ServiceCategory without action
   */
  export type ServiceCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    createdAt: number
    updatedAt: number
    businessId: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    createdAt: Date
    updatedAt: Date
    businessId: string
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    appointments?: boolean | Client$appointmentsArgs<ExtArgs>
    relationship?: boolean | Client$relationshipArgs<ExtArgs>
    sensitiveInfo?: boolean | Client$sensitiveInfoArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
  }

  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Client$appointmentsArgs<ExtArgs>
    relationship?: boolean | Client$relationshipArgs<ExtArgs>
    sensitiveInfo?: boolean | Client$sensitiveInfoArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      relationship: Prisma.$ClientRelationshipPayload<ExtArgs> | null
      sensitiveInfo: Prisma.$ClientSensitiveInfoPayload<ExtArgs> | null
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      createdAt: Date
      updatedAt: Date
      businessId: string
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
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
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Client$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Client$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    relationship<T extends Client$relationshipArgs<ExtArgs> = {}>(args?: Subset<T, Client$relationshipArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    sensitiveInfo<T extends Client$sensitiveInfoArgs<ExtArgs> = {}>(args?: Subset<T, Client$sensitiveInfoArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Client model
   */ 
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly name: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
    readonly businessId: FieldRef<"Client", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
  }

  /**
   * Client.appointments
   */
  export type Client$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Client.relationship
   */
  export type Client$relationshipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    where?: ClientRelationshipWhereInput
  }

  /**
   * Client.sensitiveInfo
   */
  export type Client$sensitiveInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    where?: ClientSensitiveInfoWhereInput
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model ClientSensitiveInfo
   */

  export type AggregateClientSensitiveInfo = {
    _count: ClientSensitiveInfoCountAggregateOutputType | null
    _min: ClientSensitiveInfoMinAggregateOutputType | null
    _max: ClientSensitiveInfoMaxAggregateOutputType | null
  }

  export type ClientSensitiveInfoMinAggregateOutputType = {
    id: string | null
    email: string | null
    notes: string | null
    medicalInfo: string | null
    createdAt: Date | null
    updatedAt: Date | null
    clientId: string | null
    encryptionStatus: boolean | null
    lastAccessedAt: Date | null
  }

  export type ClientSensitiveInfoMaxAggregateOutputType = {
    id: string | null
    email: string | null
    notes: string | null
    medicalInfo: string | null
    createdAt: Date | null
    updatedAt: Date | null
    clientId: string | null
    encryptionStatus: boolean | null
    lastAccessedAt: Date | null
  }

  export type ClientSensitiveInfoCountAggregateOutputType = {
    id: number
    email: number
    notes: number
    medicalInfo: number
    documents: number
    createdAt: number
    updatedAt: number
    clientId: number
    encryptionStatus: number
    lastAccessedAt: number
    accessLog: number
    _all: number
  }


  export type ClientSensitiveInfoMinAggregateInputType = {
    id?: true
    email?: true
    notes?: true
    medicalInfo?: true
    createdAt?: true
    updatedAt?: true
    clientId?: true
    encryptionStatus?: true
    lastAccessedAt?: true
  }

  export type ClientSensitiveInfoMaxAggregateInputType = {
    id?: true
    email?: true
    notes?: true
    medicalInfo?: true
    createdAt?: true
    updatedAt?: true
    clientId?: true
    encryptionStatus?: true
    lastAccessedAt?: true
  }

  export type ClientSensitiveInfoCountAggregateInputType = {
    id?: true
    email?: true
    notes?: true
    medicalInfo?: true
    documents?: true
    createdAt?: true
    updatedAt?: true
    clientId?: true
    encryptionStatus?: true
    lastAccessedAt?: true
    accessLog?: true
    _all?: true
  }

  export type ClientSensitiveInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientSensitiveInfo to aggregate.
     */
    where?: ClientSensitiveInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientSensitiveInfos to fetch.
     */
    orderBy?: ClientSensitiveInfoOrderByWithRelationInput | ClientSensitiveInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientSensitiveInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientSensitiveInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientSensitiveInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClientSensitiveInfos
    **/
    _count?: true | ClientSensitiveInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientSensitiveInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientSensitiveInfoMaxAggregateInputType
  }

  export type GetClientSensitiveInfoAggregateType<T extends ClientSensitiveInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateClientSensitiveInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClientSensitiveInfo[P]>
      : GetScalarType<T[P], AggregateClientSensitiveInfo[P]>
  }




  export type ClientSensitiveInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientSensitiveInfoWhereInput
    orderBy?: ClientSensitiveInfoOrderByWithAggregationInput | ClientSensitiveInfoOrderByWithAggregationInput[]
    by: ClientSensitiveInfoScalarFieldEnum[] | ClientSensitiveInfoScalarFieldEnum
    having?: ClientSensitiveInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientSensitiveInfoCountAggregateInputType | true
    _min?: ClientSensitiveInfoMinAggregateInputType
    _max?: ClientSensitiveInfoMaxAggregateInputType
  }

  export type ClientSensitiveInfoGroupByOutputType = {
    id: string
    email: string
    notes: string | null
    medicalInfo: string | null
    documents: JsonValue | null
    createdAt: Date
    updatedAt: Date
    clientId: string
    encryptionStatus: boolean
    lastAccessedAt: Date | null
    accessLog: JsonValue | null
    _count: ClientSensitiveInfoCountAggregateOutputType | null
    _min: ClientSensitiveInfoMinAggregateOutputType | null
    _max: ClientSensitiveInfoMaxAggregateOutputType | null
  }

  type GetClientSensitiveInfoGroupByPayload<T extends ClientSensitiveInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientSensitiveInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientSensitiveInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientSensitiveInfoGroupByOutputType[P]>
            : GetScalarType<T[P], ClientSensitiveInfoGroupByOutputType[P]>
        }
      >
    >


  export type ClientSensitiveInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    notes?: boolean
    medicalInfo?: boolean
    documents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientId?: boolean
    encryptionStatus?: boolean
    lastAccessedAt?: boolean
    accessLog?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientSensitiveInfo"]>

  export type ClientSensitiveInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    notes?: boolean
    medicalInfo?: boolean
    documents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientId?: boolean
    encryptionStatus?: boolean
    lastAccessedAt?: boolean
    accessLog?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientSensitiveInfo"]>

  export type ClientSensitiveInfoSelectScalar = {
    id?: boolean
    email?: boolean
    notes?: boolean
    medicalInfo?: boolean
    documents?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientId?: boolean
    encryptionStatus?: boolean
    lastAccessedAt?: boolean
    accessLog?: boolean
  }

  export type ClientSensitiveInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type ClientSensitiveInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $ClientSensitiveInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClientSensitiveInfo"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      notes: string | null
      medicalInfo: string | null
      documents: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      clientId: string
      encryptionStatus: boolean
      lastAccessedAt: Date | null
      accessLog: Prisma.JsonValue | null
    }, ExtArgs["result"]["clientSensitiveInfo"]>
    composites: {}
  }

  type ClientSensitiveInfoGetPayload<S extends boolean | null | undefined | ClientSensitiveInfoDefaultArgs> = $Result.GetResult<Prisma.$ClientSensitiveInfoPayload, S>

  type ClientSensitiveInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClientSensitiveInfoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClientSensitiveInfoCountAggregateInputType | true
    }

  export interface ClientSensitiveInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClientSensitiveInfo'], meta: { name: 'ClientSensitiveInfo' } }
    /**
     * Find zero or one ClientSensitiveInfo that matches the filter.
     * @param {ClientSensitiveInfoFindUniqueArgs} args - Arguments to find a ClientSensitiveInfo
     * @example
     * // Get one ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientSensitiveInfoFindUniqueArgs>(args: SelectSubset<T, ClientSensitiveInfoFindUniqueArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClientSensitiveInfo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClientSensitiveInfoFindUniqueOrThrowArgs} args - Arguments to find a ClientSensitiveInfo
     * @example
     * // Get one ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientSensitiveInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientSensitiveInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClientSensitiveInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoFindFirstArgs} args - Arguments to find a ClientSensitiveInfo
     * @example
     * // Get one ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientSensitiveInfoFindFirstArgs>(args?: SelectSubset<T, ClientSensitiveInfoFindFirstArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClientSensitiveInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoFindFirstOrThrowArgs} args - Arguments to find a ClientSensitiveInfo
     * @example
     * // Get one ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientSensitiveInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientSensitiveInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClientSensitiveInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClientSensitiveInfos
     * const clientSensitiveInfos = await prisma.clientSensitiveInfo.findMany()
     * 
     * // Get first 10 ClientSensitiveInfos
     * const clientSensitiveInfos = await prisma.clientSensitiveInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientSensitiveInfoWithIdOnly = await prisma.clientSensitiveInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientSensitiveInfoFindManyArgs>(args?: SelectSubset<T, ClientSensitiveInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClientSensitiveInfo.
     * @param {ClientSensitiveInfoCreateArgs} args - Arguments to create a ClientSensitiveInfo.
     * @example
     * // Create one ClientSensitiveInfo
     * const ClientSensitiveInfo = await prisma.clientSensitiveInfo.create({
     *   data: {
     *     // ... data to create a ClientSensitiveInfo
     *   }
     * })
     * 
     */
    create<T extends ClientSensitiveInfoCreateArgs>(args: SelectSubset<T, ClientSensitiveInfoCreateArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClientSensitiveInfos.
     * @param {ClientSensitiveInfoCreateManyArgs} args - Arguments to create many ClientSensitiveInfos.
     * @example
     * // Create many ClientSensitiveInfos
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientSensitiveInfoCreateManyArgs>(args?: SelectSubset<T, ClientSensitiveInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClientSensitiveInfos and returns the data saved in the database.
     * @param {ClientSensitiveInfoCreateManyAndReturnArgs} args - Arguments to create many ClientSensitiveInfos.
     * @example
     * // Create many ClientSensitiveInfos
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClientSensitiveInfos and only return the `id`
     * const clientSensitiveInfoWithIdOnly = await prisma.clientSensitiveInfo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientSensitiveInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientSensitiveInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClientSensitiveInfo.
     * @param {ClientSensitiveInfoDeleteArgs} args - Arguments to delete one ClientSensitiveInfo.
     * @example
     * // Delete one ClientSensitiveInfo
     * const ClientSensitiveInfo = await prisma.clientSensitiveInfo.delete({
     *   where: {
     *     // ... filter to delete one ClientSensitiveInfo
     *   }
     * })
     * 
     */
    delete<T extends ClientSensitiveInfoDeleteArgs>(args: SelectSubset<T, ClientSensitiveInfoDeleteArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClientSensitiveInfo.
     * @param {ClientSensitiveInfoUpdateArgs} args - Arguments to update one ClientSensitiveInfo.
     * @example
     * // Update one ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientSensitiveInfoUpdateArgs>(args: SelectSubset<T, ClientSensitiveInfoUpdateArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClientSensitiveInfos.
     * @param {ClientSensitiveInfoDeleteManyArgs} args - Arguments to filter ClientSensitiveInfos to delete.
     * @example
     * // Delete a few ClientSensitiveInfos
     * const { count } = await prisma.clientSensitiveInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientSensitiveInfoDeleteManyArgs>(args?: SelectSubset<T, ClientSensitiveInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClientSensitiveInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClientSensitiveInfos
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientSensitiveInfoUpdateManyArgs>(args: SelectSubset<T, ClientSensitiveInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClientSensitiveInfo.
     * @param {ClientSensitiveInfoUpsertArgs} args - Arguments to update or create a ClientSensitiveInfo.
     * @example
     * // Update or create a ClientSensitiveInfo
     * const clientSensitiveInfo = await prisma.clientSensitiveInfo.upsert({
     *   create: {
     *     // ... data to create a ClientSensitiveInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClientSensitiveInfo we want to update
     *   }
     * })
     */
    upsert<T extends ClientSensitiveInfoUpsertArgs>(args: SelectSubset<T, ClientSensitiveInfoUpsertArgs<ExtArgs>>): Prisma__ClientSensitiveInfoClient<$Result.GetResult<Prisma.$ClientSensitiveInfoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClientSensitiveInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoCountArgs} args - Arguments to filter ClientSensitiveInfos to count.
     * @example
     * // Count the number of ClientSensitiveInfos
     * const count = await prisma.clientSensitiveInfo.count({
     *   where: {
     *     // ... the filter for the ClientSensitiveInfos we want to count
     *   }
     * })
    **/
    count<T extends ClientSensitiveInfoCountArgs>(
      args?: Subset<T, ClientSensitiveInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientSensitiveInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClientSensitiveInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClientSensitiveInfoAggregateArgs>(args: Subset<T, ClientSensitiveInfoAggregateArgs>): Prisma.PrismaPromise<GetClientSensitiveInfoAggregateType<T>>

    /**
     * Group by ClientSensitiveInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientSensitiveInfoGroupByArgs} args - Group by arguments.
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
      T extends ClientSensitiveInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientSensitiveInfoGroupByArgs['orderBy'] }
        : { orderBy?: ClientSensitiveInfoGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClientSensitiveInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientSensitiveInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClientSensitiveInfo model
   */
  readonly fields: ClientSensitiveInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClientSensitiveInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientSensitiveInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ClientSensitiveInfo model
   */ 
  interface ClientSensitiveInfoFieldRefs {
    readonly id: FieldRef<"ClientSensitiveInfo", 'String'>
    readonly email: FieldRef<"ClientSensitiveInfo", 'String'>
    readonly notes: FieldRef<"ClientSensitiveInfo", 'String'>
    readonly medicalInfo: FieldRef<"ClientSensitiveInfo", 'String'>
    readonly documents: FieldRef<"ClientSensitiveInfo", 'Json'>
    readonly createdAt: FieldRef<"ClientSensitiveInfo", 'DateTime'>
    readonly updatedAt: FieldRef<"ClientSensitiveInfo", 'DateTime'>
    readonly clientId: FieldRef<"ClientSensitiveInfo", 'String'>
    readonly encryptionStatus: FieldRef<"ClientSensitiveInfo", 'Boolean'>
    readonly lastAccessedAt: FieldRef<"ClientSensitiveInfo", 'DateTime'>
    readonly accessLog: FieldRef<"ClientSensitiveInfo", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * ClientSensitiveInfo findUnique
   */
  export type ClientSensitiveInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter, which ClientSensitiveInfo to fetch.
     */
    where: ClientSensitiveInfoWhereUniqueInput
  }

  /**
   * ClientSensitiveInfo findUniqueOrThrow
   */
  export type ClientSensitiveInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter, which ClientSensitiveInfo to fetch.
     */
    where: ClientSensitiveInfoWhereUniqueInput
  }

  /**
   * ClientSensitiveInfo findFirst
   */
  export type ClientSensitiveInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter, which ClientSensitiveInfo to fetch.
     */
    where?: ClientSensitiveInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientSensitiveInfos to fetch.
     */
    orderBy?: ClientSensitiveInfoOrderByWithRelationInput | ClientSensitiveInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientSensitiveInfos.
     */
    cursor?: ClientSensitiveInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientSensitiveInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientSensitiveInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientSensitiveInfos.
     */
    distinct?: ClientSensitiveInfoScalarFieldEnum | ClientSensitiveInfoScalarFieldEnum[]
  }

  /**
   * ClientSensitiveInfo findFirstOrThrow
   */
  export type ClientSensitiveInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter, which ClientSensitiveInfo to fetch.
     */
    where?: ClientSensitiveInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientSensitiveInfos to fetch.
     */
    orderBy?: ClientSensitiveInfoOrderByWithRelationInput | ClientSensitiveInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientSensitiveInfos.
     */
    cursor?: ClientSensitiveInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientSensitiveInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientSensitiveInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientSensitiveInfos.
     */
    distinct?: ClientSensitiveInfoScalarFieldEnum | ClientSensitiveInfoScalarFieldEnum[]
  }

  /**
   * ClientSensitiveInfo findMany
   */
  export type ClientSensitiveInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter, which ClientSensitiveInfos to fetch.
     */
    where?: ClientSensitiveInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientSensitiveInfos to fetch.
     */
    orderBy?: ClientSensitiveInfoOrderByWithRelationInput | ClientSensitiveInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClientSensitiveInfos.
     */
    cursor?: ClientSensitiveInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientSensitiveInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientSensitiveInfos.
     */
    skip?: number
    distinct?: ClientSensitiveInfoScalarFieldEnum | ClientSensitiveInfoScalarFieldEnum[]
  }

  /**
   * ClientSensitiveInfo create
   */
  export type ClientSensitiveInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a ClientSensitiveInfo.
     */
    data: XOR<ClientSensitiveInfoCreateInput, ClientSensitiveInfoUncheckedCreateInput>
  }

  /**
   * ClientSensitiveInfo createMany
   */
  export type ClientSensitiveInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClientSensitiveInfos.
     */
    data: ClientSensitiveInfoCreateManyInput | ClientSensitiveInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClientSensitiveInfo createManyAndReturn
   */
  export type ClientSensitiveInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClientSensitiveInfos.
     */
    data: ClientSensitiveInfoCreateManyInput | ClientSensitiveInfoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClientSensitiveInfo update
   */
  export type ClientSensitiveInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a ClientSensitiveInfo.
     */
    data: XOR<ClientSensitiveInfoUpdateInput, ClientSensitiveInfoUncheckedUpdateInput>
    /**
     * Choose, which ClientSensitiveInfo to update.
     */
    where: ClientSensitiveInfoWhereUniqueInput
  }

  /**
   * ClientSensitiveInfo updateMany
   */
  export type ClientSensitiveInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClientSensitiveInfos.
     */
    data: XOR<ClientSensitiveInfoUpdateManyMutationInput, ClientSensitiveInfoUncheckedUpdateManyInput>
    /**
     * Filter which ClientSensitiveInfos to update
     */
    where?: ClientSensitiveInfoWhereInput
  }

  /**
   * ClientSensitiveInfo upsert
   */
  export type ClientSensitiveInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the ClientSensitiveInfo to update in case it exists.
     */
    where: ClientSensitiveInfoWhereUniqueInput
    /**
     * In case the ClientSensitiveInfo found by the `where` argument doesn't exist, create a new ClientSensitiveInfo with this data.
     */
    create: XOR<ClientSensitiveInfoCreateInput, ClientSensitiveInfoUncheckedCreateInput>
    /**
     * In case the ClientSensitiveInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientSensitiveInfoUpdateInput, ClientSensitiveInfoUncheckedUpdateInput>
  }

  /**
   * ClientSensitiveInfo delete
   */
  export type ClientSensitiveInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
    /**
     * Filter which ClientSensitiveInfo to delete.
     */
    where: ClientSensitiveInfoWhereUniqueInput
  }

  /**
   * ClientSensitiveInfo deleteMany
   */
  export type ClientSensitiveInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientSensitiveInfos to delete
     */
    where?: ClientSensitiveInfoWhereInput
  }

  /**
   * ClientSensitiveInfo without action
   */
  export type ClientSensitiveInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientSensitiveInfo
     */
    select?: ClientSensitiveInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientSensitiveInfoInclude<ExtArgs> | null
  }


  /**
   * Model Service
   */

  export type AggregateService = {
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  export type ServiceAvgAggregateOutputType = {
    duration: number | null
    price: Decimal | null
  }

  export type ServiceSumAggregateOutputType = {
    duration: number | null
    price: Decimal | null
  }

  export type ServiceMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    duration: number | null
    price: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    categoryId: string | null
  }

  export type ServiceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    duration: number | null
    price: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    categoryId: string | null
  }

  export type ServiceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    duration: number
    price: number
    createdAt: number
    updatedAt: number
    businessId: number
    categoryId: number
    _all: number
  }


  export type ServiceAvgAggregateInputType = {
    duration?: true
    price?: true
  }

  export type ServiceSumAggregateInputType = {
    duration?: true
    price?: true
  }

  export type ServiceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    duration?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    categoryId?: true
  }

  export type ServiceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    duration?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    categoryId?: true
  }

  export type ServiceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    duration?: true
    price?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    categoryId?: true
    _all?: true
  }

  export type ServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Service to aggregate.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Services
    **/
    _count?: true | ServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceMaxAggregateInputType
  }

  export type GetServiceAggregateType<T extends ServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateService[P]>
      : GetScalarType<T[P], AggregateService[P]>
  }




  export type ServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithAggregationInput | ServiceOrderByWithAggregationInput[]
    by: ServiceScalarFieldEnum[] | ServiceScalarFieldEnum
    having?: ServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceCountAggregateInputType | true
    _avg?: ServiceAvgAggregateInputType
    _sum?: ServiceSumAggregateInputType
    _min?: ServiceMinAggregateInputType
    _max?: ServiceMaxAggregateInputType
  }

  export type ServiceGroupByOutputType = {
    id: string
    name: string
    description: string | null
    duration: number
    price: Decimal
    createdAt: Date
    updatedAt: Date
    businessId: string
    categoryId: string | null
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  type GetServiceGroupByPayload<T extends ServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceGroupByOutputType[P]>
        }
      >
    >


  export type ServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    duration?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    categoryId?: boolean
    appointments?: boolean | Service$appointmentsArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    category?: boolean | Service$categoryArgs<ExtArgs>
    providers?: boolean | Service$providersArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    duration?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    categoryId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    category?: boolean | Service$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    duration?: boolean
    price?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    categoryId?: boolean
  }

  export type ServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Service$appointmentsArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    category?: boolean | Service$categoryArgs<ExtArgs>
    providers?: boolean | Service$providersArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    category?: boolean | Service$categoryArgs<ExtArgs>
  }

  export type $ServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Service"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      business: Prisma.$BusinessPayload<ExtArgs>
      category: Prisma.$ServiceCategoryPayload<ExtArgs> | null
      providers: Prisma.$StaffPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      duration: number
      price: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
      businessId: string
      categoryId: string | null
    }, ExtArgs["result"]["service"]>
    composites: {}
  }

  type ServiceGetPayload<S extends boolean | null | undefined | ServiceDefaultArgs> = $Result.GetResult<Prisma.$ServicePayload, S>

  type ServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ServiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ServiceCountAggregateInputType | true
    }

  export interface ServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Service'], meta: { name: 'Service' } }
    /**
     * Find zero or one Service that matches the filter.
     * @param {ServiceFindUniqueArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceFindUniqueArgs>(args: SelectSubset<T, ServiceFindUniqueArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Service that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ServiceFindUniqueOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Service that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceFindFirstArgs>(args?: SelectSubset<T, ServiceFindFirstArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Service that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Services that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Services
     * const services = await prisma.service.findMany()
     * 
     * // Get first 10 Services
     * const services = await prisma.service.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceWithIdOnly = await prisma.service.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceFindManyArgs>(args?: SelectSubset<T, ServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Service.
     * @param {ServiceCreateArgs} args - Arguments to create a Service.
     * @example
     * // Create one Service
     * const Service = await prisma.service.create({
     *   data: {
     *     // ... data to create a Service
     *   }
     * })
     * 
     */
    create<T extends ServiceCreateArgs>(args: SelectSubset<T, ServiceCreateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Services.
     * @param {ServiceCreateManyArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceCreateManyArgs>(args?: SelectSubset<T, ServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Services and returns the data saved in the database.
     * @param {ServiceCreateManyAndReturnArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Services and only return the `id`
     * const serviceWithIdOnly = await prisma.service.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Service.
     * @param {ServiceDeleteArgs} args - Arguments to delete one Service.
     * @example
     * // Delete one Service
     * const Service = await prisma.service.delete({
     *   where: {
     *     // ... filter to delete one Service
     *   }
     * })
     * 
     */
    delete<T extends ServiceDeleteArgs>(args: SelectSubset<T, ServiceDeleteArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Service.
     * @param {ServiceUpdateArgs} args - Arguments to update one Service.
     * @example
     * // Update one Service
     * const service = await prisma.service.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceUpdateArgs>(args: SelectSubset<T, ServiceUpdateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Services.
     * @param {ServiceDeleteManyArgs} args - Arguments to filter Services to delete.
     * @example
     * // Delete a few Services
     * const { count } = await prisma.service.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceDeleteManyArgs>(args?: SelectSubset<T, ServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Services
     * const service = await prisma.service.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceUpdateManyArgs>(args: SelectSubset<T, ServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Service.
     * @param {ServiceUpsertArgs} args - Arguments to update or create a Service.
     * @example
     * // Update or create a Service
     * const service = await prisma.service.upsert({
     *   create: {
     *     // ... data to create a Service
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Service we want to update
     *   }
     * })
     */
    upsert<T extends ServiceUpsertArgs>(args: SelectSubset<T, ServiceUpsertArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCountArgs} args - Arguments to filter Services to count.
     * @example
     * // Count the number of Services
     * const count = await prisma.service.count({
     *   where: {
     *     // ... the filter for the Services we want to count
     *   }
     * })
    **/
    count<T extends ServiceCountArgs>(
      args?: Subset<T, ServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServiceAggregateArgs>(args: Subset<T, ServiceAggregateArgs>): Prisma.PrismaPromise<GetServiceAggregateType<T>>

    /**
     * Group by Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceGroupByArgs} args - Group by arguments.
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
      T extends ServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceGroupByArgs['orderBy'] }
        : { orderBy?: ServiceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Service model
   */
  readonly fields: ServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Service.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Service$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Service$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany"> | Null>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    category<T extends Service$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Service$categoryArgs<ExtArgs>>): Prisma__ServiceCategoryClient<$Result.GetResult<Prisma.$ServiceCategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    providers<T extends Service$providersArgs<ExtArgs> = {}>(args?: Subset<T, Service$providersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Service model
   */ 
  interface ServiceFieldRefs {
    readonly id: FieldRef<"Service", 'String'>
    readonly name: FieldRef<"Service", 'String'>
    readonly description: FieldRef<"Service", 'String'>
    readonly duration: FieldRef<"Service", 'Int'>
    readonly price: FieldRef<"Service", 'Decimal'>
    readonly createdAt: FieldRef<"Service", 'DateTime'>
    readonly updatedAt: FieldRef<"Service", 'DateTime'>
    readonly businessId: FieldRef<"Service", 'String'>
    readonly categoryId: FieldRef<"Service", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Service findUnique
   */
  export type ServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findUniqueOrThrow
   */
  export type ServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findFirst
   */
  export type ServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findFirstOrThrow
   */
  export type ServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findMany
   */
  export type ServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Services to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service create
   */
  export type ServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Service.
     */
    data: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
  }

  /**
   * Service createMany
   */
  export type ServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Service createManyAndReturn
   */
  export type ServiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Service update
   */
  export type ServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Service.
     */
    data: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
    /**
     * Choose, which Service to update.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service updateMany
   */
  export type ServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Services.
     */
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyInput>
    /**
     * Filter which Services to update
     */
    where?: ServiceWhereInput
  }

  /**
   * Service upsert
   */
  export type ServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Service to update in case it exists.
     */
    where: ServiceWhereUniqueInput
    /**
     * In case the Service found by the `where` argument doesn't exist, create a new Service with this data.
     */
    create: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
    /**
     * In case the Service was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
  }

  /**
   * Service delete
   */
  export type ServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter which Service to delete.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service deleteMany
   */
  export type ServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Services to delete
     */
    where?: ServiceWhereInput
  }

  /**
   * Service.appointments
   */
  export type Service$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Service.category
   */
  export type Service$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCategory
     */
    select?: ServiceCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceCategoryInclude<ExtArgs> | null
    where?: ServiceCategoryWhereInput
  }

  /**
   * Service.providers
   */
  export type Service$providersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    cursor?: StaffWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * Service without action
   */
  export type ServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.AppointmentStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    clientId: string | null
    serviceId: string | null
    staffId: string | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.AppointmentStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    clientId: string | null
    serviceId: string | null
    staffId: string | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    startTime: number
    endTime: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    businessId: number
    clientId: number
    serviceId: number
    staffId: number
    _all: number
  }


  export type AppointmentMinAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    clientId?: true
    serviceId?: true
    staffId?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    clientId?: true
    serviceId?: true
    staffId?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    clientId?: true
    serviceId?: true
    staffId?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    startTime: Date
    endTime: Date
    status: $Enums.AppointmentStatus
    notes: string | null
    createdAt: Date
    updatedAt: Date
    businessId: string
    clientId: string
    serviceId: string
    staffId: string
    _count: AppointmentCountAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    clientId?: boolean
    serviceId?: boolean
    staffId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    staff?: boolean | StaffDefaultArgs<ExtArgs>
    payment?: boolean | Appointment$paymentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    clientId?: boolean
    serviceId?: boolean
    staffId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    clientId?: boolean
    serviceId?: boolean
    staffId?: boolean
  }

  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    staff?: boolean | StaffDefaultArgs<ExtArgs>
    payment?: boolean | Appointment$paymentArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      client: Prisma.$ClientPayload<ExtArgs>
      service: Prisma.$ServicePayload<ExtArgs>
      staff: Prisma.$StaffPayload<ExtArgs>
      payment: Prisma.$PaymentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      startTime: Date
      endTime: Date
      status: $Enums.AppointmentStatus
      notes: string | null
      createdAt: Date
      updatedAt: Date
      businessId: string
      clientId: string
      serviceId: string
      staffId: string
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
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
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    service<T extends ServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServiceDefaultArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    staff<T extends StaffDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StaffDefaultArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    payment<T extends Appointment$paymentArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$paymentArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the Appointment model
   */ 
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly startTime: FieldRef<"Appointment", 'DateTime'>
    readonly endTime: FieldRef<"Appointment", 'DateTime'>
    readonly status: FieldRef<"Appointment", 'AppointmentStatus'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly updatedAt: FieldRef<"Appointment", 'DateTime'>
    readonly businessId: FieldRef<"Appointment", 'String'>
    readonly clientId: FieldRef<"Appointment", 'String'>
    readonly serviceId: FieldRef<"Appointment", 'String'>
    readonly staffId: FieldRef<"Appointment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
  }

  /**
   * Appointment.payment
   */
  export type Appointment$paymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    amount: Decimal | null
    status: $Enums.PaymentStatus | null
    paymentMethod: $Enums.PaymentMethod | null
    createdAt: Date | null
    updatedAt: Date | null
    appointmentId: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    amount: Decimal | null
    status: $Enums.PaymentStatus | null
    paymentMethod: $Enums.PaymentMethod | null
    createdAt: Date | null
    updatedAt: Date | null
    appointmentId: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    amount: number
    status: number
    paymentMethod: number
    createdAt: number
    updatedAt: number
    appointmentId: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    amount?: true
    status?: true
    paymentMethod?: true
    createdAt?: true
    updatedAt?: true
    appointmentId?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    amount?: true
    status?: true
    paymentMethod?: true
    createdAt?: true
    updatedAt?: true
    appointmentId?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    amount?: true
    status?: true
    paymentMethod?: true
    createdAt?: true
    updatedAt?: true
    appointmentId?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    amount: Decimal
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt: Date
    updatedAt: Date
    appointmentId: string
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    status?: boolean
    paymentMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointmentId?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    status?: boolean
    paymentMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointmentId?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    amount?: boolean
    status?: boolean
    paymentMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointmentId?: boolean
  }

  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      appointment: Prisma.$AppointmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      amount: Prisma.Decimal
      status: $Enums.PaymentStatus
      paymentMethod: $Enums.PaymentMethod
      createdAt: Date
      updatedAt: Date
      appointmentId: string
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
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
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointment<T extends AppointmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppointmentDefaultArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Payment model
   */ 
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly paymentMethod: FieldRef<"Payment", 'PaymentMethod'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
    readonly appointmentId: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Schedule
   */

  export type AggregateSchedule = {
    _count: ScheduleCountAggregateOutputType | null
    _avg: ScheduleAvgAggregateOutputType | null
    _sum: ScheduleSumAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  export type ScheduleAvgAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type ScheduleSumAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type ScheduleMinAggregateOutputType = {
    id: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    staffId: string | null
  }

  export type ScheduleMaxAggregateOutputType = {
    id: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    staffId: string | null
  }

  export type ScheduleCountAggregateOutputType = {
    id: number
    dayOfWeek: number
    startTime: number
    endTime: number
    staffId: number
    _all: number
  }


  export type ScheduleAvgAggregateInputType = {
    dayOfWeek?: true
  }

  export type ScheduleSumAggregateInputType = {
    dayOfWeek?: true
  }

  export type ScheduleMinAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    staffId?: true
  }

  export type ScheduleMaxAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    staffId?: true
  }

  export type ScheduleCountAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    staffId?: true
    _all?: true
  }

  export type ScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedule to aggregate.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Schedules
    **/
    _count?: true | ScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduleMaxAggregateInputType
  }

  export type GetScheduleAggregateType<T extends ScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchedule[P]>
      : GetScalarType<T[P], AggregateSchedule[P]>
  }




  export type ScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithAggregationInput | ScheduleOrderByWithAggregationInput[]
    by: ScheduleScalarFieldEnum[] | ScheduleScalarFieldEnum
    having?: ScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduleCountAggregateInputType | true
    _avg?: ScheduleAvgAggregateInputType
    _sum?: ScheduleSumAggregateInputType
    _min?: ScheduleMinAggregateInputType
    _max?: ScheduleMaxAggregateInputType
  }

  export type ScheduleGroupByOutputType = {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    staffId: string
    _count: ScheduleCountAggregateOutputType | null
    _avg: ScheduleAvgAggregateOutputType | null
    _sum: ScheduleSumAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  type GetScheduleGroupByPayload<T extends ScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    staffId?: boolean
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    staffId?: boolean
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectScalar = {
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    staffId?: boolean
  }

  export type ScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }
  export type ScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    staff?: boolean | StaffDefaultArgs<ExtArgs>
  }

  export type $SchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Schedule"
    objects: {
      staff: Prisma.$StaffPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dayOfWeek: number
      startTime: string
      endTime: string
      staffId: string
    }, ExtArgs["result"]["schedule"]>
    composites: {}
  }

  type ScheduleGetPayload<S extends boolean | null | undefined | ScheduleDefaultArgs> = $Result.GetResult<Prisma.$SchedulePayload, S>

  type ScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ScheduleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ScheduleCountAggregateInputType | true
    }

  export interface ScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Schedule'], meta: { name: 'Schedule' } }
    /**
     * Find zero or one Schedule that matches the filter.
     * @param {ScheduleFindUniqueArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduleFindUniqueArgs>(args: SelectSubset<T, ScheduleFindUniqueArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Schedule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ScheduleFindUniqueOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Schedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduleFindFirstArgs>(args?: SelectSubset<T, ScheduleFindFirstArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Schedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Schedules
     * const schedules = await prisma.schedule.findMany()
     * 
     * // Get first 10 Schedules
     * const schedules = await prisma.schedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduleWithIdOnly = await prisma.schedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduleFindManyArgs>(args?: SelectSubset<T, ScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Schedule.
     * @param {ScheduleCreateArgs} args - Arguments to create a Schedule.
     * @example
     * // Create one Schedule
     * const Schedule = await prisma.schedule.create({
     *   data: {
     *     // ... data to create a Schedule
     *   }
     * })
     * 
     */
    create<T extends ScheduleCreateArgs>(args: SelectSubset<T, ScheduleCreateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Schedules.
     * @param {ScheduleCreateManyArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduleCreateManyArgs>(args?: SelectSubset<T, ScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Schedules and returns the data saved in the database.
     * @param {ScheduleCreateManyAndReturnArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Schedules and only return the `id`
     * const scheduleWithIdOnly = await prisma.schedule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Schedule.
     * @param {ScheduleDeleteArgs} args - Arguments to delete one Schedule.
     * @example
     * // Delete one Schedule
     * const Schedule = await prisma.schedule.delete({
     *   where: {
     *     // ... filter to delete one Schedule
     *   }
     * })
     * 
     */
    delete<T extends ScheduleDeleteArgs>(args: SelectSubset<T, ScheduleDeleteArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Schedule.
     * @param {ScheduleUpdateArgs} args - Arguments to update one Schedule.
     * @example
     * // Update one Schedule
     * const schedule = await prisma.schedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduleUpdateArgs>(args: SelectSubset<T, ScheduleUpdateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Schedules.
     * @param {ScheduleDeleteManyArgs} args - Arguments to filter Schedules to delete.
     * @example
     * // Delete a few Schedules
     * const { count } = await prisma.schedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduleDeleteManyArgs>(args?: SelectSubset<T, ScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Schedules
     * const schedule = await prisma.schedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduleUpdateManyArgs>(args: SelectSubset<T, ScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Schedule.
     * @param {ScheduleUpsertArgs} args - Arguments to update or create a Schedule.
     * @example
     * // Update or create a Schedule
     * const schedule = await prisma.schedule.upsert({
     *   create: {
     *     // ... data to create a Schedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Schedule we want to update
     *   }
     * })
     */
    upsert<T extends ScheduleUpsertArgs>(args: SelectSubset<T, ScheduleUpsertArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCountArgs} args - Arguments to filter Schedules to count.
     * @example
     * // Count the number of Schedules
     * const count = await prisma.schedule.count({
     *   where: {
     *     // ... the filter for the Schedules we want to count
     *   }
     * })
    **/
    count<T extends ScheduleCountArgs>(
      args?: Subset<T, ScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScheduleAggregateArgs>(args: Subset<T, ScheduleAggregateArgs>): Prisma.PrismaPromise<GetScheduleAggregateType<T>>

    /**
     * Group by Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleGroupByArgs} args - Group by arguments.
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
      T extends ScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ScheduleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Schedule model
   */
  readonly fields: ScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Schedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    staff<T extends StaffDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StaffDefaultArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Schedule model
   */ 
  interface ScheduleFieldRefs {
    readonly id: FieldRef<"Schedule", 'String'>
    readonly dayOfWeek: FieldRef<"Schedule", 'Int'>
    readonly startTime: FieldRef<"Schedule", 'String'>
    readonly endTime: FieldRef<"Schedule", 'String'>
    readonly staffId: FieldRef<"Schedule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Schedule findUnique
   */
  export type ScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findUniqueOrThrow
   */
  export type ScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findFirst
   */
  export type ScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findFirstOrThrow
   */
  export type ScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findMany
   */
  export type ScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedules to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule create
   */
  export type ScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a Schedule.
     */
    data: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
  }

  /**
   * Schedule createMany
   */
  export type ScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Schedule createManyAndReturn
   */
  export type ScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Schedule update
   */
  export type ScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a Schedule.
     */
    data: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
    /**
     * Choose, which Schedule to update.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule updateMany
   */
  export type ScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Schedules.
     */
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyInput>
    /**
     * Filter which Schedules to update
     */
    where?: ScheduleWhereInput
  }

  /**
   * Schedule upsert
   */
  export type ScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the Schedule to update in case it exists.
     */
    where: ScheduleWhereUniqueInput
    /**
     * In case the Schedule found by the `where` argument doesn't exist, create a new Schedule with this data.
     */
    create: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
    /**
     * In case the Schedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
  }

  /**
   * Schedule delete
   */
  export type ScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter which Schedule to delete.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule deleteMany
   */
  export type ScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedules to delete
     */
    where?: ScheduleWhereInput
  }

  /**
   * Schedule without action
   */
  export type ScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
  }


  /**
   * Model BusinessHours
   */

  export type AggregateBusinessHours = {
    _count: BusinessHoursCountAggregateOutputType | null
    _avg: BusinessHoursAvgAggregateOutputType | null
    _sum: BusinessHoursSumAggregateOutputType | null
    _min: BusinessHoursMinAggregateOutputType | null
    _max: BusinessHoursMaxAggregateOutputType | null
  }

  export type BusinessHoursAvgAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type BusinessHoursSumAggregateOutputType = {
    dayOfWeek: number | null
  }

  export type BusinessHoursMinAggregateOutputType = {
    id: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    isClosed: boolean | null
    businessId: string | null
  }

  export type BusinessHoursMaxAggregateOutputType = {
    id: string | null
    dayOfWeek: number | null
    startTime: string | null
    endTime: string | null
    isClosed: boolean | null
    businessId: string | null
  }

  export type BusinessHoursCountAggregateOutputType = {
    id: number
    dayOfWeek: number
    startTime: number
    endTime: number
    isClosed: number
    businessId: number
    _all: number
  }


  export type BusinessHoursAvgAggregateInputType = {
    dayOfWeek?: true
  }

  export type BusinessHoursSumAggregateInputType = {
    dayOfWeek?: true
  }

  export type BusinessHoursMinAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isClosed?: true
    businessId?: true
  }

  export type BusinessHoursMaxAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isClosed?: true
    businessId?: true
  }

  export type BusinessHoursCountAggregateInputType = {
    id?: true
    dayOfWeek?: true
    startTime?: true
    endTime?: true
    isClosed?: true
    businessId?: true
    _all?: true
  }

  export type BusinessHoursAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessHours to aggregate.
     */
    where?: BusinessHoursWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessHours to fetch.
     */
    orderBy?: BusinessHoursOrderByWithRelationInput | BusinessHoursOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessHoursWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessHours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessHours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BusinessHours
    **/
    _count?: true | BusinessHoursCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BusinessHoursAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BusinessHoursSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessHoursMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessHoursMaxAggregateInputType
  }

  export type GetBusinessHoursAggregateType<T extends BusinessHoursAggregateArgs> = {
        [P in keyof T & keyof AggregateBusinessHours]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusinessHours[P]>
      : GetScalarType<T[P], AggregateBusinessHours[P]>
  }




  export type BusinessHoursGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessHoursWhereInput
    orderBy?: BusinessHoursOrderByWithAggregationInput | BusinessHoursOrderByWithAggregationInput[]
    by: BusinessHoursScalarFieldEnum[] | BusinessHoursScalarFieldEnum
    having?: BusinessHoursScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessHoursCountAggregateInputType | true
    _avg?: BusinessHoursAvgAggregateInputType
    _sum?: BusinessHoursSumAggregateInputType
    _min?: BusinessHoursMinAggregateInputType
    _max?: BusinessHoursMaxAggregateInputType
  }

  export type BusinessHoursGroupByOutputType = {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed: boolean
    businessId: string
    _count: BusinessHoursCountAggregateOutputType | null
    _avg: BusinessHoursAvgAggregateOutputType | null
    _sum: BusinessHoursSumAggregateOutputType | null
    _min: BusinessHoursMinAggregateOutputType | null
    _max: BusinessHoursMaxAggregateOutputType | null
  }

  type GetBusinessHoursGroupByPayload<T extends BusinessHoursGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessHoursGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessHoursGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessHoursGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessHoursGroupByOutputType[P]>
        }
      >
    >


  export type BusinessHoursSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isClosed?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["businessHours"]>

  export type BusinessHoursSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isClosed?: boolean
    businessId?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["businessHours"]>

  export type BusinessHoursSelectScalar = {
    id?: boolean
    dayOfWeek?: boolean
    startTime?: boolean
    endTime?: boolean
    isClosed?: boolean
    businessId?: boolean
  }

  export type BusinessHoursInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type BusinessHoursIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $BusinessHoursPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BusinessHours"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      dayOfWeek: number
      startTime: string
      endTime: string
      isClosed: boolean
      businessId: string
    }, ExtArgs["result"]["businessHours"]>
    composites: {}
  }

  type BusinessHoursGetPayload<S extends boolean | null | undefined | BusinessHoursDefaultArgs> = $Result.GetResult<Prisma.$BusinessHoursPayload, S>

  type BusinessHoursCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BusinessHoursFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BusinessHoursCountAggregateInputType | true
    }

  export interface BusinessHoursDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BusinessHours'], meta: { name: 'BusinessHours' } }
    /**
     * Find zero or one BusinessHours that matches the filter.
     * @param {BusinessHoursFindUniqueArgs} args - Arguments to find a BusinessHours
     * @example
     * // Get one BusinessHours
     * const businessHours = await prisma.businessHours.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessHoursFindUniqueArgs>(args: SelectSubset<T, BusinessHoursFindUniqueArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one BusinessHours that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BusinessHoursFindUniqueOrThrowArgs} args - Arguments to find a BusinessHours
     * @example
     * // Get one BusinessHours
     * const businessHours = await prisma.businessHours.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessHoursFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessHoursFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first BusinessHours that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursFindFirstArgs} args - Arguments to find a BusinessHours
     * @example
     * // Get one BusinessHours
     * const businessHours = await prisma.businessHours.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessHoursFindFirstArgs>(args?: SelectSubset<T, BusinessHoursFindFirstArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first BusinessHours that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursFindFirstOrThrowArgs} args - Arguments to find a BusinessHours
     * @example
     * // Get one BusinessHours
     * const businessHours = await prisma.businessHours.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessHoursFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessHoursFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more BusinessHours that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BusinessHours
     * const businessHours = await prisma.businessHours.findMany()
     * 
     * // Get first 10 BusinessHours
     * const businessHours = await prisma.businessHours.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessHoursWithIdOnly = await prisma.businessHours.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessHoursFindManyArgs>(args?: SelectSubset<T, BusinessHoursFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a BusinessHours.
     * @param {BusinessHoursCreateArgs} args - Arguments to create a BusinessHours.
     * @example
     * // Create one BusinessHours
     * const BusinessHours = await prisma.businessHours.create({
     *   data: {
     *     // ... data to create a BusinessHours
     *   }
     * })
     * 
     */
    create<T extends BusinessHoursCreateArgs>(args: SelectSubset<T, BusinessHoursCreateArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many BusinessHours.
     * @param {BusinessHoursCreateManyArgs} args - Arguments to create many BusinessHours.
     * @example
     * // Create many BusinessHours
     * const businessHours = await prisma.businessHours.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessHoursCreateManyArgs>(args?: SelectSubset<T, BusinessHoursCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BusinessHours and returns the data saved in the database.
     * @param {BusinessHoursCreateManyAndReturnArgs} args - Arguments to create many BusinessHours.
     * @example
     * // Create many BusinessHours
     * const businessHours = await prisma.businessHours.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BusinessHours and only return the `id`
     * const businessHoursWithIdOnly = await prisma.businessHours.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BusinessHoursCreateManyAndReturnArgs>(args?: SelectSubset<T, BusinessHoursCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a BusinessHours.
     * @param {BusinessHoursDeleteArgs} args - Arguments to delete one BusinessHours.
     * @example
     * // Delete one BusinessHours
     * const BusinessHours = await prisma.businessHours.delete({
     *   where: {
     *     // ... filter to delete one BusinessHours
     *   }
     * })
     * 
     */
    delete<T extends BusinessHoursDeleteArgs>(args: SelectSubset<T, BusinessHoursDeleteArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one BusinessHours.
     * @param {BusinessHoursUpdateArgs} args - Arguments to update one BusinessHours.
     * @example
     * // Update one BusinessHours
     * const businessHours = await prisma.businessHours.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessHoursUpdateArgs>(args: SelectSubset<T, BusinessHoursUpdateArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more BusinessHours.
     * @param {BusinessHoursDeleteManyArgs} args - Arguments to filter BusinessHours to delete.
     * @example
     * // Delete a few BusinessHours
     * const { count } = await prisma.businessHours.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessHoursDeleteManyArgs>(args?: SelectSubset<T, BusinessHoursDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BusinessHours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BusinessHours
     * const businessHours = await prisma.businessHours.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessHoursUpdateManyArgs>(args: SelectSubset<T, BusinessHoursUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BusinessHours.
     * @param {BusinessHoursUpsertArgs} args - Arguments to update or create a BusinessHours.
     * @example
     * // Update or create a BusinessHours
     * const businessHours = await prisma.businessHours.upsert({
     *   create: {
     *     // ... data to create a BusinessHours
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BusinessHours we want to update
     *   }
     * })
     */
    upsert<T extends BusinessHoursUpsertArgs>(args: SelectSubset<T, BusinessHoursUpsertArgs<ExtArgs>>): Prisma__BusinessHoursClient<$Result.GetResult<Prisma.$BusinessHoursPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of BusinessHours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursCountArgs} args - Arguments to filter BusinessHours to count.
     * @example
     * // Count the number of BusinessHours
     * const count = await prisma.businessHours.count({
     *   where: {
     *     // ... the filter for the BusinessHours we want to count
     *   }
     * })
    **/
    count<T extends BusinessHoursCountArgs>(
      args?: Subset<T, BusinessHoursCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessHoursCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BusinessHours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BusinessHoursAggregateArgs>(args: Subset<T, BusinessHoursAggregateArgs>): Prisma.PrismaPromise<GetBusinessHoursAggregateType<T>>

    /**
     * Group by BusinessHours.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessHoursGroupByArgs} args - Group by arguments.
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
      T extends BusinessHoursGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessHoursGroupByArgs['orderBy'] }
        : { orderBy?: BusinessHoursGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BusinessHoursGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessHoursGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BusinessHours model
   */
  readonly fields: BusinessHoursFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BusinessHours.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessHoursClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the BusinessHours model
   */ 
  interface BusinessHoursFieldRefs {
    readonly id: FieldRef<"BusinessHours", 'String'>
    readonly dayOfWeek: FieldRef<"BusinessHours", 'Int'>
    readonly startTime: FieldRef<"BusinessHours", 'String'>
    readonly endTime: FieldRef<"BusinessHours", 'String'>
    readonly isClosed: FieldRef<"BusinessHours", 'Boolean'>
    readonly businessId: FieldRef<"BusinessHours", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BusinessHours findUnique
   */
  export type BusinessHoursFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter, which BusinessHours to fetch.
     */
    where: BusinessHoursWhereUniqueInput
  }

  /**
   * BusinessHours findUniqueOrThrow
   */
  export type BusinessHoursFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter, which BusinessHours to fetch.
     */
    where: BusinessHoursWhereUniqueInput
  }

  /**
   * BusinessHours findFirst
   */
  export type BusinessHoursFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter, which BusinessHours to fetch.
     */
    where?: BusinessHoursWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessHours to fetch.
     */
    orderBy?: BusinessHoursOrderByWithRelationInput | BusinessHoursOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BusinessHours.
     */
    cursor?: BusinessHoursWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessHours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessHours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BusinessHours.
     */
    distinct?: BusinessHoursScalarFieldEnum | BusinessHoursScalarFieldEnum[]
  }

  /**
   * BusinessHours findFirstOrThrow
   */
  export type BusinessHoursFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter, which BusinessHours to fetch.
     */
    where?: BusinessHoursWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessHours to fetch.
     */
    orderBy?: BusinessHoursOrderByWithRelationInput | BusinessHoursOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BusinessHours.
     */
    cursor?: BusinessHoursWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessHours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessHours.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BusinessHours.
     */
    distinct?: BusinessHoursScalarFieldEnum | BusinessHoursScalarFieldEnum[]
  }

  /**
   * BusinessHours findMany
   */
  export type BusinessHoursFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter, which BusinessHours to fetch.
     */
    where?: BusinessHoursWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BusinessHours to fetch.
     */
    orderBy?: BusinessHoursOrderByWithRelationInput | BusinessHoursOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BusinessHours.
     */
    cursor?: BusinessHoursWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BusinessHours from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BusinessHours.
     */
    skip?: number
    distinct?: BusinessHoursScalarFieldEnum | BusinessHoursScalarFieldEnum[]
  }

  /**
   * BusinessHours create
   */
  export type BusinessHoursCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * The data needed to create a BusinessHours.
     */
    data: XOR<BusinessHoursCreateInput, BusinessHoursUncheckedCreateInput>
  }

  /**
   * BusinessHours createMany
   */
  export type BusinessHoursCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BusinessHours.
     */
    data: BusinessHoursCreateManyInput | BusinessHoursCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BusinessHours createManyAndReturn
   */
  export type BusinessHoursCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many BusinessHours.
     */
    data: BusinessHoursCreateManyInput | BusinessHoursCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BusinessHours update
   */
  export type BusinessHoursUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * The data needed to update a BusinessHours.
     */
    data: XOR<BusinessHoursUpdateInput, BusinessHoursUncheckedUpdateInput>
    /**
     * Choose, which BusinessHours to update.
     */
    where: BusinessHoursWhereUniqueInput
  }

  /**
   * BusinessHours updateMany
   */
  export type BusinessHoursUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BusinessHours.
     */
    data: XOR<BusinessHoursUpdateManyMutationInput, BusinessHoursUncheckedUpdateManyInput>
    /**
     * Filter which BusinessHours to update
     */
    where?: BusinessHoursWhereInput
  }

  /**
   * BusinessHours upsert
   */
  export type BusinessHoursUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * The filter to search for the BusinessHours to update in case it exists.
     */
    where: BusinessHoursWhereUniqueInput
    /**
     * In case the BusinessHours found by the `where` argument doesn't exist, create a new BusinessHours with this data.
     */
    create: XOR<BusinessHoursCreateInput, BusinessHoursUncheckedCreateInput>
    /**
     * In case the BusinessHours was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessHoursUpdateInput, BusinessHoursUncheckedUpdateInput>
  }

  /**
   * BusinessHours delete
   */
  export type BusinessHoursDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
    /**
     * Filter which BusinessHours to delete.
     */
    where: BusinessHoursWhereUniqueInput
  }

  /**
   * BusinessHours deleteMany
   */
  export type BusinessHoursDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BusinessHours to delete
     */
    where?: BusinessHoursWhereInput
  }

  /**
   * BusinessHours without action
   */
  export type BusinessHoursDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessHours
     */
    select?: BusinessHoursSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessHoursInclude<ExtArgs> | null
  }


  /**
   * Model ClientRelationship
   */

  export type AggregateClientRelationship = {
    _count: ClientRelationshipCountAggregateOutputType | null
    _avg: ClientRelationshipAvgAggregateOutputType | null
    _sum: ClientRelationshipSumAggregateOutputType | null
    _min: ClientRelationshipMinAggregateOutputType | null
    _max: ClientRelationshipMaxAggregateOutputType | null
  }

  export type ClientRelationshipAvgAggregateOutputType = {
    visitFrequency: number | null
    lifetimeValue: Decimal | null
  }

  export type ClientRelationshipSumAggregateOutputType = {
    visitFrequency: number | null
    lifetimeValue: Decimal | null
  }

  export type ClientRelationshipMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    businessId: string | null
    status: $Enums.ClientStatus | null
    relationshipStartDate: Date | null
    lastVisit: Date | null
    visitFrequency: number | null
    lifetimeValue: Decimal | null
    internalNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientRelationshipMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    businessId: string | null
    status: $Enums.ClientStatus | null
    relationshipStartDate: Date | null
    lastVisit: Date | null
    visitFrequency: number | null
    lifetimeValue: Decimal | null
    internalNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientRelationshipCountAggregateOutputType = {
    id: number
    clientId: number
    businessId: number
    status: number
    relationshipStartDate: number
    lastVisit: number
    visitFrequency: number
    lifetimeValue: number
    preferences: number
    internalNotes: number
    flags: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientRelationshipAvgAggregateInputType = {
    visitFrequency?: true
    lifetimeValue?: true
  }

  export type ClientRelationshipSumAggregateInputType = {
    visitFrequency?: true
    lifetimeValue?: true
  }

  export type ClientRelationshipMinAggregateInputType = {
    id?: true
    clientId?: true
    businessId?: true
    status?: true
    relationshipStartDate?: true
    lastVisit?: true
    visitFrequency?: true
    lifetimeValue?: true
    internalNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientRelationshipMaxAggregateInputType = {
    id?: true
    clientId?: true
    businessId?: true
    status?: true
    relationshipStartDate?: true
    lastVisit?: true
    visitFrequency?: true
    lifetimeValue?: true
    internalNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientRelationshipCountAggregateInputType = {
    id?: true
    clientId?: true
    businessId?: true
    status?: true
    relationshipStartDate?: true
    lastVisit?: true
    visitFrequency?: true
    lifetimeValue?: true
    preferences?: true
    internalNotes?: true
    flags?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientRelationshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientRelationship to aggregate.
     */
    where?: ClientRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientRelationships to fetch.
     */
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClientRelationships
    **/
    _count?: true | ClientRelationshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ClientRelationshipAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ClientRelationshipSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientRelationshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientRelationshipMaxAggregateInputType
  }

  export type GetClientRelationshipAggregateType<T extends ClientRelationshipAggregateArgs> = {
        [P in keyof T & keyof AggregateClientRelationship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClientRelationship[P]>
      : GetScalarType<T[P], AggregateClientRelationship[P]>
  }




  export type ClientRelationshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientRelationshipWhereInput
    orderBy?: ClientRelationshipOrderByWithAggregationInput | ClientRelationshipOrderByWithAggregationInput[]
    by: ClientRelationshipScalarFieldEnum[] | ClientRelationshipScalarFieldEnum
    having?: ClientRelationshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientRelationshipCountAggregateInputType | true
    _avg?: ClientRelationshipAvgAggregateInputType
    _sum?: ClientRelationshipSumAggregateInputType
    _min?: ClientRelationshipMinAggregateInputType
    _max?: ClientRelationshipMaxAggregateInputType
  }

  export type ClientRelationshipGroupByOutputType = {
    id: string
    clientId: string
    businessId: string
    status: $Enums.ClientStatus
    relationshipStartDate: Date
    lastVisit: Date | null
    visitFrequency: number | null
    lifetimeValue: Decimal | null
    preferences: JsonValue | null
    internalNotes: string | null
    flags: $Enums.ClientFlag[]
    createdAt: Date
    updatedAt: Date
    _count: ClientRelationshipCountAggregateOutputType | null
    _avg: ClientRelationshipAvgAggregateOutputType | null
    _sum: ClientRelationshipSumAggregateOutputType | null
    _min: ClientRelationshipMinAggregateOutputType | null
    _max: ClientRelationshipMaxAggregateOutputType | null
  }

  type GetClientRelationshipGroupByPayload<T extends ClientRelationshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientRelationshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientRelationshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientRelationshipGroupByOutputType[P]>
            : GetScalarType<T[P], ClientRelationshipGroupByOutputType[P]>
        }
      >
    >


  export type ClientRelationshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    businessId?: boolean
    status?: boolean
    relationshipStartDate?: boolean
    lastVisit?: boolean
    visitFrequency?: boolean
    lifetimeValue?: boolean
    preferences?: boolean
    internalNotes?: boolean
    flags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    noteHistory?: boolean | ClientRelationship$noteHistoryArgs<ExtArgs>
    visitHistory?: boolean | ClientRelationship$visitHistoryArgs<ExtArgs>
    preferredStaff?: boolean | ClientRelationship$preferredStaffArgs<ExtArgs>
    _count?: boolean | ClientRelationshipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientRelationship"]>

  export type ClientRelationshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    businessId?: boolean
    status?: boolean
    relationshipStartDate?: boolean
    lastVisit?: boolean
    visitFrequency?: boolean
    lifetimeValue?: boolean
    preferences?: boolean
    internalNotes?: boolean
    flags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clientRelationship"]>

  export type ClientRelationshipSelectScalar = {
    id?: boolean
    clientId?: boolean
    businessId?: boolean
    status?: boolean
    relationshipStartDate?: boolean
    lastVisit?: boolean
    visitFrequency?: boolean
    lifetimeValue?: boolean
    preferences?: boolean
    internalNotes?: boolean
    flags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientRelationshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
    noteHistory?: boolean | ClientRelationship$noteHistoryArgs<ExtArgs>
    visitHistory?: boolean | ClientRelationship$visitHistoryArgs<ExtArgs>
    preferredStaff?: boolean | ClientRelationship$preferredStaffArgs<ExtArgs>
    _count?: boolean | ClientRelationshipCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientRelationshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $ClientRelationshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClientRelationship"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      client: Prisma.$ClientPayload<ExtArgs>
      noteHistory: Prisma.$RelationshipNotePayload<ExtArgs>[]
      visitHistory: Prisma.$VisitHistoryPayload<ExtArgs>[]
      preferredStaff: Prisma.$StaffPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      businessId: string
      status: $Enums.ClientStatus
      relationshipStartDate: Date
      lastVisit: Date | null
      visitFrequency: number | null
      lifetimeValue: Prisma.Decimal | null
      preferences: Prisma.JsonValue | null
      internalNotes: string | null
      flags: $Enums.ClientFlag[]
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clientRelationship"]>
    composites: {}
  }

  type ClientRelationshipGetPayload<S extends boolean | null | undefined | ClientRelationshipDefaultArgs> = $Result.GetResult<Prisma.$ClientRelationshipPayload, S>

  type ClientRelationshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ClientRelationshipFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ClientRelationshipCountAggregateInputType | true
    }

  export interface ClientRelationshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClientRelationship'], meta: { name: 'ClientRelationship' } }
    /**
     * Find zero or one ClientRelationship that matches the filter.
     * @param {ClientRelationshipFindUniqueArgs} args - Arguments to find a ClientRelationship
     * @example
     * // Get one ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientRelationshipFindUniqueArgs>(args: SelectSubset<T, ClientRelationshipFindUniqueArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ClientRelationship that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ClientRelationshipFindUniqueOrThrowArgs} args - Arguments to find a ClientRelationship
     * @example
     * // Get one ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientRelationshipFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientRelationshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ClientRelationship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipFindFirstArgs} args - Arguments to find a ClientRelationship
     * @example
     * // Get one ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientRelationshipFindFirstArgs>(args?: SelectSubset<T, ClientRelationshipFindFirstArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ClientRelationship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipFindFirstOrThrowArgs} args - Arguments to find a ClientRelationship
     * @example
     * // Get one ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientRelationshipFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientRelationshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ClientRelationships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClientRelationships
     * const clientRelationships = await prisma.clientRelationship.findMany()
     * 
     * // Get first 10 ClientRelationships
     * const clientRelationships = await prisma.clientRelationship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientRelationshipWithIdOnly = await prisma.clientRelationship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientRelationshipFindManyArgs>(args?: SelectSubset<T, ClientRelationshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ClientRelationship.
     * @param {ClientRelationshipCreateArgs} args - Arguments to create a ClientRelationship.
     * @example
     * // Create one ClientRelationship
     * const ClientRelationship = await prisma.clientRelationship.create({
     *   data: {
     *     // ... data to create a ClientRelationship
     *   }
     * })
     * 
     */
    create<T extends ClientRelationshipCreateArgs>(args: SelectSubset<T, ClientRelationshipCreateArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ClientRelationships.
     * @param {ClientRelationshipCreateManyArgs} args - Arguments to create many ClientRelationships.
     * @example
     * // Create many ClientRelationships
     * const clientRelationship = await prisma.clientRelationship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientRelationshipCreateManyArgs>(args?: SelectSubset<T, ClientRelationshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClientRelationships and returns the data saved in the database.
     * @param {ClientRelationshipCreateManyAndReturnArgs} args - Arguments to create many ClientRelationships.
     * @example
     * // Create many ClientRelationships
     * const clientRelationship = await prisma.clientRelationship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClientRelationships and only return the `id`
     * const clientRelationshipWithIdOnly = await prisma.clientRelationship.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientRelationshipCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientRelationshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ClientRelationship.
     * @param {ClientRelationshipDeleteArgs} args - Arguments to delete one ClientRelationship.
     * @example
     * // Delete one ClientRelationship
     * const ClientRelationship = await prisma.clientRelationship.delete({
     *   where: {
     *     // ... filter to delete one ClientRelationship
     *   }
     * })
     * 
     */
    delete<T extends ClientRelationshipDeleteArgs>(args: SelectSubset<T, ClientRelationshipDeleteArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ClientRelationship.
     * @param {ClientRelationshipUpdateArgs} args - Arguments to update one ClientRelationship.
     * @example
     * // Update one ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientRelationshipUpdateArgs>(args: SelectSubset<T, ClientRelationshipUpdateArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ClientRelationships.
     * @param {ClientRelationshipDeleteManyArgs} args - Arguments to filter ClientRelationships to delete.
     * @example
     * // Delete a few ClientRelationships
     * const { count } = await prisma.clientRelationship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientRelationshipDeleteManyArgs>(args?: SelectSubset<T, ClientRelationshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClientRelationships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClientRelationships
     * const clientRelationship = await prisma.clientRelationship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientRelationshipUpdateManyArgs>(args: SelectSubset<T, ClientRelationshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ClientRelationship.
     * @param {ClientRelationshipUpsertArgs} args - Arguments to update or create a ClientRelationship.
     * @example
     * // Update or create a ClientRelationship
     * const clientRelationship = await prisma.clientRelationship.upsert({
     *   create: {
     *     // ... data to create a ClientRelationship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClientRelationship we want to update
     *   }
     * })
     */
    upsert<T extends ClientRelationshipUpsertArgs>(args: SelectSubset<T, ClientRelationshipUpsertArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ClientRelationships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipCountArgs} args - Arguments to filter ClientRelationships to count.
     * @example
     * // Count the number of ClientRelationships
     * const count = await prisma.clientRelationship.count({
     *   where: {
     *     // ... the filter for the ClientRelationships we want to count
     *   }
     * })
    **/
    count<T extends ClientRelationshipCountArgs>(
      args?: Subset<T, ClientRelationshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientRelationshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClientRelationship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ClientRelationshipAggregateArgs>(args: Subset<T, ClientRelationshipAggregateArgs>): Prisma.PrismaPromise<GetClientRelationshipAggregateType<T>>

    /**
     * Group by ClientRelationship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientRelationshipGroupByArgs} args - Group by arguments.
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
      T extends ClientRelationshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientRelationshipGroupByArgs['orderBy'] }
        : { orderBy?: ClientRelationshipGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ClientRelationshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientRelationshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClientRelationship model
   */
  readonly fields: ClientRelationshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClientRelationship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientRelationshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    noteHistory<T extends ClientRelationship$noteHistoryArgs<ExtArgs> = {}>(args?: Subset<T, ClientRelationship$noteHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findMany"> | Null>
    visitHistory<T extends ClientRelationship$visitHistoryArgs<ExtArgs> = {}>(args?: Subset<T, ClientRelationship$visitHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findMany"> | Null>
    preferredStaff<T extends ClientRelationship$preferredStaffArgs<ExtArgs> = {}>(args?: Subset<T, ClientRelationship$preferredStaffArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the ClientRelationship model
   */ 
  interface ClientRelationshipFieldRefs {
    readonly id: FieldRef<"ClientRelationship", 'String'>
    readonly clientId: FieldRef<"ClientRelationship", 'String'>
    readonly businessId: FieldRef<"ClientRelationship", 'String'>
    readonly status: FieldRef<"ClientRelationship", 'ClientStatus'>
    readonly relationshipStartDate: FieldRef<"ClientRelationship", 'DateTime'>
    readonly lastVisit: FieldRef<"ClientRelationship", 'DateTime'>
    readonly visitFrequency: FieldRef<"ClientRelationship", 'Int'>
    readonly lifetimeValue: FieldRef<"ClientRelationship", 'Decimal'>
    readonly preferences: FieldRef<"ClientRelationship", 'Json'>
    readonly internalNotes: FieldRef<"ClientRelationship", 'String'>
    readonly flags: FieldRef<"ClientRelationship", 'ClientFlag[]'>
    readonly createdAt: FieldRef<"ClientRelationship", 'DateTime'>
    readonly updatedAt: FieldRef<"ClientRelationship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClientRelationship findUnique
   */
  export type ClientRelationshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which ClientRelationship to fetch.
     */
    where: ClientRelationshipWhereUniqueInput
  }

  /**
   * ClientRelationship findUniqueOrThrow
   */
  export type ClientRelationshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which ClientRelationship to fetch.
     */
    where: ClientRelationshipWhereUniqueInput
  }

  /**
   * ClientRelationship findFirst
   */
  export type ClientRelationshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which ClientRelationship to fetch.
     */
    where?: ClientRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientRelationships to fetch.
     */
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientRelationships.
     */
    cursor?: ClientRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientRelationships.
     */
    distinct?: ClientRelationshipScalarFieldEnum | ClientRelationshipScalarFieldEnum[]
  }

  /**
   * ClientRelationship findFirstOrThrow
   */
  export type ClientRelationshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which ClientRelationship to fetch.
     */
    where?: ClientRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientRelationships to fetch.
     */
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClientRelationships.
     */
    cursor?: ClientRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientRelationships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClientRelationships.
     */
    distinct?: ClientRelationshipScalarFieldEnum | ClientRelationshipScalarFieldEnum[]
  }

  /**
   * ClientRelationship findMany
   */
  export type ClientRelationshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter, which ClientRelationships to fetch.
     */
    where?: ClientRelationshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClientRelationships to fetch.
     */
    orderBy?: ClientRelationshipOrderByWithRelationInput | ClientRelationshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClientRelationships.
     */
    cursor?: ClientRelationshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClientRelationships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClientRelationships.
     */
    skip?: number
    distinct?: ClientRelationshipScalarFieldEnum | ClientRelationshipScalarFieldEnum[]
  }

  /**
   * ClientRelationship create
   */
  export type ClientRelationshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * The data needed to create a ClientRelationship.
     */
    data: XOR<ClientRelationshipCreateInput, ClientRelationshipUncheckedCreateInput>
  }

  /**
   * ClientRelationship createMany
   */
  export type ClientRelationshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClientRelationships.
     */
    data: ClientRelationshipCreateManyInput | ClientRelationshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClientRelationship createManyAndReturn
   */
  export type ClientRelationshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ClientRelationships.
     */
    data: ClientRelationshipCreateManyInput | ClientRelationshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClientRelationship update
   */
  export type ClientRelationshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * The data needed to update a ClientRelationship.
     */
    data: XOR<ClientRelationshipUpdateInput, ClientRelationshipUncheckedUpdateInput>
    /**
     * Choose, which ClientRelationship to update.
     */
    where: ClientRelationshipWhereUniqueInput
  }

  /**
   * ClientRelationship updateMany
   */
  export type ClientRelationshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClientRelationships.
     */
    data: XOR<ClientRelationshipUpdateManyMutationInput, ClientRelationshipUncheckedUpdateManyInput>
    /**
     * Filter which ClientRelationships to update
     */
    where?: ClientRelationshipWhereInput
  }

  /**
   * ClientRelationship upsert
   */
  export type ClientRelationshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * The filter to search for the ClientRelationship to update in case it exists.
     */
    where: ClientRelationshipWhereUniqueInput
    /**
     * In case the ClientRelationship found by the `where` argument doesn't exist, create a new ClientRelationship with this data.
     */
    create: XOR<ClientRelationshipCreateInput, ClientRelationshipUncheckedCreateInput>
    /**
     * In case the ClientRelationship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientRelationshipUpdateInput, ClientRelationshipUncheckedUpdateInput>
  }

  /**
   * ClientRelationship delete
   */
  export type ClientRelationshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
    /**
     * Filter which ClientRelationship to delete.
     */
    where: ClientRelationshipWhereUniqueInput
  }

  /**
   * ClientRelationship deleteMany
   */
  export type ClientRelationshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClientRelationships to delete
     */
    where?: ClientRelationshipWhereInput
  }

  /**
   * ClientRelationship.noteHistory
   */
  export type ClientRelationship$noteHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    where?: RelationshipNoteWhereInput
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    cursor?: RelationshipNoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RelationshipNoteScalarFieldEnum | RelationshipNoteScalarFieldEnum[]
  }

  /**
   * ClientRelationship.visitHistory
   */
  export type ClientRelationship$visitHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    where?: VisitHistoryWhereInput
    orderBy?: VisitHistoryOrderByWithRelationInput | VisitHistoryOrderByWithRelationInput[]
    cursor?: VisitHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VisitHistoryScalarFieldEnum | VisitHistoryScalarFieldEnum[]
  }

  /**
   * ClientRelationship.preferredStaff
   */
  export type ClientRelationship$preferredStaffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Staff
     */
    select?: StaffSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StaffInclude<ExtArgs> | null
    where?: StaffWhereInput
    orderBy?: StaffOrderByWithRelationInput | StaffOrderByWithRelationInput[]
    cursor?: StaffWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StaffScalarFieldEnum | StaffScalarFieldEnum[]
  }

  /**
   * ClientRelationship without action
   */
  export type ClientRelationshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientRelationship
     */
    select?: ClientRelationshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientRelationshipInclude<ExtArgs> | null
  }


  /**
   * Model VisitHistory
   */

  export type AggregateVisitHistory = {
    _count: VisitHistoryCountAggregateOutputType | null
    _min: VisitHistoryMinAggregateOutputType | null
    _max: VisitHistoryMaxAggregateOutputType | null
  }

  export type VisitHistoryMinAggregateOutputType = {
    id: string | null
    relationshipId: string | null
    visitDate: Date | null
    serviceType: string | null
    staffNotes: string | null
    clientFeedback: string | null
    followUpRequired: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisitHistoryMaxAggregateOutputType = {
    id: string | null
    relationshipId: string | null
    visitDate: Date | null
    serviceType: string | null
    staffNotes: string | null
    clientFeedback: string | null
    followUpRequired: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VisitHistoryCountAggregateOutputType = {
    id: number
    relationshipId: number
    visitDate: number
    serviceType: number
    staffNotes: number
    clientFeedback: number
    followUpRequired: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VisitHistoryMinAggregateInputType = {
    id?: true
    relationshipId?: true
    visitDate?: true
    serviceType?: true
    staffNotes?: true
    clientFeedback?: true
    followUpRequired?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisitHistoryMaxAggregateInputType = {
    id?: true
    relationshipId?: true
    visitDate?: true
    serviceType?: true
    staffNotes?: true
    clientFeedback?: true
    followUpRequired?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VisitHistoryCountAggregateInputType = {
    id?: true
    relationshipId?: true
    visitDate?: true
    serviceType?: true
    staffNotes?: true
    clientFeedback?: true
    followUpRequired?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VisitHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitHistory to aggregate.
     */
    where?: VisitHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitHistories to fetch.
     */
    orderBy?: VisitHistoryOrderByWithRelationInput | VisitHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VisitHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VisitHistories
    **/
    _count?: true | VisitHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VisitHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VisitHistoryMaxAggregateInputType
  }

  export type GetVisitHistoryAggregateType<T extends VisitHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateVisitHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVisitHistory[P]>
      : GetScalarType<T[P], AggregateVisitHistory[P]>
  }




  export type VisitHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VisitHistoryWhereInput
    orderBy?: VisitHistoryOrderByWithAggregationInput | VisitHistoryOrderByWithAggregationInput[]
    by: VisitHistoryScalarFieldEnum[] | VisitHistoryScalarFieldEnum
    having?: VisitHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VisitHistoryCountAggregateInputType | true
    _min?: VisitHistoryMinAggregateInputType
    _max?: VisitHistoryMaxAggregateInputType
  }

  export type VisitHistoryGroupByOutputType = {
    id: string
    relationshipId: string
    visitDate: Date
    serviceType: string
    staffNotes: string | null
    clientFeedback: string | null
    followUpRequired: boolean
    createdAt: Date
    updatedAt: Date
    _count: VisitHistoryCountAggregateOutputType | null
    _min: VisitHistoryMinAggregateOutputType | null
    _max: VisitHistoryMaxAggregateOutputType | null
  }

  type GetVisitHistoryGroupByPayload<T extends VisitHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VisitHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VisitHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VisitHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], VisitHistoryGroupByOutputType[P]>
        }
      >
    >


  export type VisitHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    relationshipId?: boolean
    visitDate?: boolean
    serviceType?: boolean
    staffNotes?: boolean
    clientFeedback?: boolean
    followUpRequired?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitHistory"]>

  export type VisitHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    relationshipId?: boolean
    visitDate?: boolean
    serviceType?: boolean
    staffNotes?: boolean
    clientFeedback?: boolean
    followUpRequired?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["visitHistory"]>

  export type VisitHistorySelectScalar = {
    id?: boolean
    relationshipId?: boolean
    visitDate?: boolean
    serviceType?: boolean
    staffNotes?: boolean
    clientFeedback?: boolean
    followUpRequired?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VisitHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }
  export type VisitHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }

  export type $VisitHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VisitHistory"
    objects: {
      clientRelationship: Prisma.$ClientRelationshipPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      relationshipId: string
      visitDate: Date
      serviceType: string
      staffNotes: string | null
      clientFeedback: string | null
      followUpRequired: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["visitHistory"]>
    composites: {}
  }

  type VisitHistoryGetPayload<S extends boolean | null | undefined | VisitHistoryDefaultArgs> = $Result.GetResult<Prisma.$VisitHistoryPayload, S>

  type VisitHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VisitHistoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VisitHistoryCountAggregateInputType | true
    }

  export interface VisitHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VisitHistory'], meta: { name: 'VisitHistory' } }
    /**
     * Find zero or one VisitHistory that matches the filter.
     * @param {VisitHistoryFindUniqueArgs} args - Arguments to find a VisitHistory
     * @example
     * // Get one VisitHistory
     * const visitHistory = await prisma.visitHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VisitHistoryFindUniqueArgs>(args: SelectSubset<T, VisitHistoryFindUniqueArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VisitHistory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VisitHistoryFindUniqueOrThrowArgs} args - Arguments to find a VisitHistory
     * @example
     * // Get one VisitHistory
     * const visitHistory = await prisma.visitHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VisitHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, VisitHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VisitHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryFindFirstArgs} args - Arguments to find a VisitHistory
     * @example
     * // Get one VisitHistory
     * const visitHistory = await prisma.visitHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VisitHistoryFindFirstArgs>(args?: SelectSubset<T, VisitHistoryFindFirstArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VisitHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryFindFirstOrThrowArgs} args - Arguments to find a VisitHistory
     * @example
     * // Get one VisitHistory
     * const visitHistory = await prisma.visitHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VisitHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, VisitHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VisitHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VisitHistories
     * const visitHistories = await prisma.visitHistory.findMany()
     * 
     * // Get first 10 VisitHistories
     * const visitHistories = await prisma.visitHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const visitHistoryWithIdOnly = await prisma.visitHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VisitHistoryFindManyArgs>(args?: SelectSubset<T, VisitHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VisitHistory.
     * @param {VisitHistoryCreateArgs} args - Arguments to create a VisitHistory.
     * @example
     * // Create one VisitHistory
     * const VisitHistory = await prisma.visitHistory.create({
     *   data: {
     *     // ... data to create a VisitHistory
     *   }
     * })
     * 
     */
    create<T extends VisitHistoryCreateArgs>(args: SelectSubset<T, VisitHistoryCreateArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VisitHistories.
     * @param {VisitHistoryCreateManyArgs} args - Arguments to create many VisitHistories.
     * @example
     * // Create many VisitHistories
     * const visitHistory = await prisma.visitHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VisitHistoryCreateManyArgs>(args?: SelectSubset<T, VisitHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VisitHistories and returns the data saved in the database.
     * @param {VisitHistoryCreateManyAndReturnArgs} args - Arguments to create many VisitHistories.
     * @example
     * // Create many VisitHistories
     * const visitHistory = await prisma.visitHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VisitHistories and only return the `id`
     * const visitHistoryWithIdOnly = await prisma.visitHistory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VisitHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, VisitHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VisitHistory.
     * @param {VisitHistoryDeleteArgs} args - Arguments to delete one VisitHistory.
     * @example
     * // Delete one VisitHistory
     * const VisitHistory = await prisma.visitHistory.delete({
     *   where: {
     *     // ... filter to delete one VisitHistory
     *   }
     * })
     * 
     */
    delete<T extends VisitHistoryDeleteArgs>(args: SelectSubset<T, VisitHistoryDeleteArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VisitHistory.
     * @param {VisitHistoryUpdateArgs} args - Arguments to update one VisitHistory.
     * @example
     * // Update one VisitHistory
     * const visitHistory = await prisma.visitHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VisitHistoryUpdateArgs>(args: SelectSubset<T, VisitHistoryUpdateArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VisitHistories.
     * @param {VisitHistoryDeleteManyArgs} args - Arguments to filter VisitHistories to delete.
     * @example
     * // Delete a few VisitHistories
     * const { count } = await prisma.visitHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VisitHistoryDeleteManyArgs>(args?: SelectSubset<T, VisitHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VisitHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VisitHistories
     * const visitHistory = await prisma.visitHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VisitHistoryUpdateManyArgs>(args: SelectSubset<T, VisitHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VisitHistory.
     * @param {VisitHistoryUpsertArgs} args - Arguments to update or create a VisitHistory.
     * @example
     * // Update or create a VisitHistory
     * const visitHistory = await prisma.visitHistory.upsert({
     *   create: {
     *     // ... data to create a VisitHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VisitHistory we want to update
     *   }
     * })
     */
    upsert<T extends VisitHistoryUpsertArgs>(args: SelectSubset<T, VisitHistoryUpsertArgs<ExtArgs>>): Prisma__VisitHistoryClient<$Result.GetResult<Prisma.$VisitHistoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VisitHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryCountArgs} args - Arguments to filter VisitHistories to count.
     * @example
     * // Count the number of VisitHistories
     * const count = await prisma.visitHistory.count({
     *   where: {
     *     // ... the filter for the VisitHistories we want to count
     *   }
     * })
    **/
    count<T extends VisitHistoryCountArgs>(
      args?: Subset<T, VisitHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VisitHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VisitHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VisitHistoryAggregateArgs>(args: Subset<T, VisitHistoryAggregateArgs>): Prisma.PrismaPromise<GetVisitHistoryAggregateType<T>>

    /**
     * Group by VisitHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VisitHistoryGroupByArgs} args - Group by arguments.
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
      T extends VisitHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VisitHistoryGroupByArgs['orderBy'] }
        : { orderBy?: VisitHistoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VisitHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVisitHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VisitHistory model
   */
  readonly fields: VisitHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VisitHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VisitHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    clientRelationship<T extends ClientRelationshipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientRelationshipDefaultArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the VisitHistory model
   */ 
  interface VisitHistoryFieldRefs {
    readonly id: FieldRef<"VisitHistory", 'String'>
    readonly relationshipId: FieldRef<"VisitHistory", 'String'>
    readonly visitDate: FieldRef<"VisitHistory", 'DateTime'>
    readonly serviceType: FieldRef<"VisitHistory", 'String'>
    readonly staffNotes: FieldRef<"VisitHistory", 'String'>
    readonly clientFeedback: FieldRef<"VisitHistory", 'String'>
    readonly followUpRequired: FieldRef<"VisitHistory", 'Boolean'>
    readonly createdAt: FieldRef<"VisitHistory", 'DateTime'>
    readonly updatedAt: FieldRef<"VisitHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VisitHistory findUnique
   */
  export type VisitHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter, which VisitHistory to fetch.
     */
    where: VisitHistoryWhereUniqueInput
  }

  /**
   * VisitHistory findUniqueOrThrow
   */
  export type VisitHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter, which VisitHistory to fetch.
     */
    where: VisitHistoryWhereUniqueInput
  }

  /**
   * VisitHistory findFirst
   */
  export type VisitHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter, which VisitHistory to fetch.
     */
    where?: VisitHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitHistories to fetch.
     */
    orderBy?: VisitHistoryOrderByWithRelationInput | VisitHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitHistories.
     */
    cursor?: VisitHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitHistories.
     */
    distinct?: VisitHistoryScalarFieldEnum | VisitHistoryScalarFieldEnum[]
  }

  /**
   * VisitHistory findFirstOrThrow
   */
  export type VisitHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter, which VisitHistory to fetch.
     */
    where?: VisitHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitHistories to fetch.
     */
    orderBy?: VisitHistoryOrderByWithRelationInput | VisitHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VisitHistories.
     */
    cursor?: VisitHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VisitHistories.
     */
    distinct?: VisitHistoryScalarFieldEnum | VisitHistoryScalarFieldEnum[]
  }

  /**
   * VisitHistory findMany
   */
  export type VisitHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter, which VisitHistories to fetch.
     */
    where?: VisitHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VisitHistories to fetch.
     */
    orderBy?: VisitHistoryOrderByWithRelationInput | VisitHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VisitHistories.
     */
    cursor?: VisitHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VisitHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VisitHistories.
     */
    skip?: number
    distinct?: VisitHistoryScalarFieldEnum | VisitHistoryScalarFieldEnum[]
  }

  /**
   * VisitHistory create
   */
  export type VisitHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a VisitHistory.
     */
    data: XOR<VisitHistoryCreateInput, VisitHistoryUncheckedCreateInput>
  }

  /**
   * VisitHistory createMany
   */
  export type VisitHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VisitHistories.
     */
    data: VisitHistoryCreateManyInput | VisitHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VisitHistory createManyAndReturn
   */
  export type VisitHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VisitHistories.
     */
    data: VisitHistoryCreateManyInput | VisitHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VisitHistory update
   */
  export type VisitHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a VisitHistory.
     */
    data: XOR<VisitHistoryUpdateInput, VisitHistoryUncheckedUpdateInput>
    /**
     * Choose, which VisitHistory to update.
     */
    where: VisitHistoryWhereUniqueInput
  }

  /**
   * VisitHistory updateMany
   */
  export type VisitHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VisitHistories.
     */
    data: XOR<VisitHistoryUpdateManyMutationInput, VisitHistoryUncheckedUpdateManyInput>
    /**
     * Filter which VisitHistories to update
     */
    where?: VisitHistoryWhereInput
  }

  /**
   * VisitHistory upsert
   */
  export type VisitHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the VisitHistory to update in case it exists.
     */
    where: VisitHistoryWhereUniqueInput
    /**
     * In case the VisitHistory found by the `where` argument doesn't exist, create a new VisitHistory with this data.
     */
    create: XOR<VisitHistoryCreateInput, VisitHistoryUncheckedCreateInput>
    /**
     * In case the VisitHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VisitHistoryUpdateInput, VisitHistoryUncheckedUpdateInput>
  }

  /**
   * VisitHistory delete
   */
  export type VisitHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
    /**
     * Filter which VisitHistory to delete.
     */
    where: VisitHistoryWhereUniqueInput
  }

  /**
   * VisitHistory deleteMany
   */
  export type VisitHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VisitHistories to delete
     */
    where?: VisitHistoryWhereInput
  }

  /**
   * VisitHistory without action
   */
  export type VisitHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VisitHistory
     */
    select?: VisitHistorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VisitHistoryInclude<ExtArgs> | null
  }


  /**
   * Model RelationshipNote
   */

  export type AggregateRelationshipNote = {
    _count: RelationshipNoteCountAggregateOutputType | null
    _min: RelationshipNoteMinAggregateOutputType | null
    _max: RelationshipNoteMaxAggregateOutputType | null
  }

  export type RelationshipNoteMinAggregateOutputType = {
    id: string | null
    relationshipId: string | null
    noteType: $Enums.NoteType | null
    content: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RelationshipNoteMaxAggregateOutputType = {
    id: string | null
    relationshipId: string | null
    noteType: $Enums.NoteType | null
    content: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RelationshipNoteCountAggregateOutputType = {
    id: number
    relationshipId: number
    noteType: number
    content: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RelationshipNoteMinAggregateInputType = {
    id?: true
    relationshipId?: true
    noteType?: true
    content?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RelationshipNoteMaxAggregateInputType = {
    id?: true
    relationshipId?: true
    noteType?: true
    content?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RelationshipNoteCountAggregateInputType = {
    id?: true
    relationshipId?: true
    noteType?: true
    content?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RelationshipNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelationshipNote to aggregate.
     */
    where?: RelationshipNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelationshipNotes to fetch.
     */
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RelationshipNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelationshipNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelationshipNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RelationshipNotes
    **/
    _count?: true | RelationshipNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RelationshipNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RelationshipNoteMaxAggregateInputType
  }

  export type GetRelationshipNoteAggregateType<T extends RelationshipNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateRelationshipNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRelationshipNote[P]>
      : GetScalarType<T[P], AggregateRelationshipNote[P]>
  }




  export type RelationshipNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RelationshipNoteWhereInput
    orderBy?: RelationshipNoteOrderByWithAggregationInput | RelationshipNoteOrderByWithAggregationInput[]
    by: RelationshipNoteScalarFieldEnum[] | RelationshipNoteScalarFieldEnum
    having?: RelationshipNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RelationshipNoteCountAggregateInputType | true
    _min?: RelationshipNoteMinAggregateInputType
    _max?: RelationshipNoteMaxAggregateInputType
  }

  export type RelationshipNoteGroupByOutputType = {
    id: string
    relationshipId: string
    noteType: $Enums.NoteType
    content: string
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: RelationshipNoteCountAggregateOutputType | null
    _min: RelationshipNoteMinAggregateOutputType | null
    _max: RelationshipNoteMaxAggregateOutputType | null
  }

  type GetRelationshipNoteGroupByPayload<T extends RelationshipNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RelationshipNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RelationshipNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RelationshipNoteGroupByOutputType[P]>
            : GetScalarType<T[P], RelationshipNoteGroupByOutputType[P]>
        }
      >
    >


  export type RelationshipNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    relationshipId?: boolean
    noteType?: boolean
    content?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | StaffDefaultArgs<ExtArgs>
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["relationshipNote"]>

  export type RelationshipNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    relationshipId?: boolean
    noteType?: boolean
    content?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | StaffDefaultArgs<ExtArgs>
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["relationshipNote"]>

  export type RelationshipNoteSelectScalar = {
    id?: boolean
    relationshipId?: boolean
    noteType?: boolean
    content?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RelationshipNoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | StaffDefaultArgs<ExtArgs>
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }
  export type RelationshipNoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | StaffDefaultArgs<ExtArgs>
    clientRelationship?: boolean | ClientRelationshipDefaultArgs<ExtArgs>
  }

  export type $RelationshipNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RelationshipNote"
    objects: {
      createdBy: Prisma.$StaffPayload<ExtArgs>
      clientRelationship: Prisma.$ClientRelationshipPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      relationshipId: string
      noteType: $Enums.NoteType
      content: string
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["relationshipNote"]>
    composites: {}
  }

  type RelationshipNoteGetPayload<S extends boolean | null | undefined | RelationshipNoteDefaultArgs> = $Result.GetResult<Prisma.$RelationshipNotePayload, S>

  type RelationshipNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RelationshipNoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RelationshipNoteCountAggregateInputType | true
    }

  export interface RelationshipNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RelationshipNote'], meta: { name: 'RelationshipNote' } }
    /**
     * Find zero or one RelationshipNote that matches the filter.
     * @param {RelationshipNoteFindUniqueArgs} args - Arguments to find a RelationshipNote
     * @example
     * // Get one RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RelationshipNoteFindUniqueArgs>(args: SelectSubset<T, RelationshipNoteFindUniqueArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one RelationshipNote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RelationshipNoteFindUniqueOrThrowArgs} args - Arguments to find a RelationshipNote
     * @example
     * // Get one RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RelationshipNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, RelationshipNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first RelationshipNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteFindFirstArgs} args - Arguments to find a RelationshipNote
     * @example
     * // Get one RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RelationshipNoteFindFirstArgs>(args?: SelectSubset<T, RelationshipNoteFindFirstArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first RelationshipNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteFindFirstOrThrowArgs} args - Arguments to find a RelationshipNote
     * @example
     * // Get one RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RelationshipNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, RelationshipNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more RelationshipNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RelationshipNotes
     * const relationshipNotes = await prisma.relationshipNote.findMany()
     * 
     * // Get first 10 RelationshipNotes
     * const relationshipNotes = await prisma.relationshipNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const relationshipNoteWithIdOnly = await prisma.relationshipNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RelationshipNoteFindManyArgs>(args?: SelectSubset<T, RelationshipNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a RelationshipNote.
     * @param {RelationshipNoteCreateArgs} args - Arguments to create a RelationshipNote.
     * @example
     * // Create one RelationshipNote
     * const RelationshipNote = await prisma.relationshipNote.create({
     *   data: {
     *     // ... data to create a RelationshipNote
     *   }
     * })
     * 
     */
    create<T extends RelationshipNoteCreateArgs>(args: SelectSubset<T, RelationshipNoteCreateArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many RelationshipNotes.
     * @param {RelationshipNoteCreateManyArgs} args - Arguments to create many RelationshipNotes.
     * @example
     * // Create many RelationshipNotes
     * const relationshipNote = await prisma.relationshipNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RelationshipNoteCreateManyArgs>(args?: SelectSubset<T, RelationshipNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RelationshipNotes and returns the data saved in the database.
     * @param {RelationshipNoteCreateManyAndReturnArgs} args - Arguments to create many RelationshipNotes.
     * @example
     * // Create many RelationshipNotes
     * const relationshipNote = await prisma.relationshipNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RelationshipNotes and only return the `id`
     * const relationshipNoteWithIdOnly = await prisma.relationshipNote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RelationshipNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, RelationshipNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a RelationshipNote.
     * @param {RelationshipNoteDeleteArgs} args - Arguments to delete one RelationshipNote.
     * @example
     * // Delete one RelationshipNote
     * const RelationshipNote = await prisma.relationshipNote.delete({
     *   where: {
     *     // ... filter to delete one RelationshipNote
     *   }
     * })
     * 
     */
    delete<T extends RelationshipNoteDeleteArgs>(args: SelectSubset<T, RelationshipNoteDeleteArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one RelationshipNote.
     * @param {RelationshipNoteUpdateArgs} args - Arguments to update one RelationshipNote.
     * @example
     * // Update one RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RelationshipNoteUpdateArgs>(args: SelectSubset<T, RelationshipNoteUpdateArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more RelationshipNotes.
     * @param {RelationshipNoteDeleteManyArgs} args - Arguments to filter RelationshipNotes to delete.
     * @example
     * // Delete a few RelationshipNotes
     * const { count } = await prisma.relationshipNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RelationshipNoteDeleteManyArgs>(args?: SelectSubset<T, RelationshipNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RelationshipNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RelationshipNotes
     * const relationshipNote = await prisma.relationshipNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RelationshipNoteUpdateManyArgs>(args: SelectSubset<T, RelationshipNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RelationshipNote.
     * @param {RelationshipNoteUpsertArgs} args - Arguments to update or create a RelationshipNote.
     * @example
     * // Update or create a RelationshipNote
     * const relationshipNote = await prisma.relationshipNote.upsert({
     *   create: {
     *     // ... data to create a RelationshipNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RelationshipNote we want to update
     *   }
     * })
     */
    upsert<T extends RelationshipNoteUpsertArgs>(args: SelectSubset<T, RelationshipNoteUpsertArgs<ExtArgs>>): Prisma__RelationshipNoteClient<$Result.GetResult<Prisma.$RelationshipNotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of RelationshipNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteCountArgs} args - Arguments to filter RelationshipNotes to count.
     * @example
     * // Count the number of RelationshipNotes
     * const count = await prisma.relationshipNote.count({
     *   where: {
     *     // ... the filter for the RelationshipNotes we want to count
     *   }
     * })
    **/
    count<T extends RelationshipNoteCountArgs>(
      args?: Subset<T, RelationshipNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RelationshipNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RelationshipNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RelationshipNoteAggregateArgs>(args: Subset<T, RelationshipNoteAggregateArgs>): Prisma.PrismaPromise<GetRelationshipNoteAggregateType<T>>

    /**
     * Group by RelationshipNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RelationshipNoteGroupByArgs} args - Group by arguments.
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
      T extends RelationshipNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RelationshipNoteGroupByArgs['orderBy'] }
        : { orderBy?: RelationshipNoteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RelationshipNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRelationshipNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RelationshipNote model
   */
  readonly fields: RelationshipNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RelationshipNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RelationshipNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends StaffDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StaffDefaultArgs<ExtArgs>>): Prisma__StaffClient<$Result.GetResult<Prisma.$StaffPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    clientRelationship<T extends ClientRelationshipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientRelationshipDefaultArgs<ExtArgs>>): Prisma__ClientRelationshipClient<$Result.GetResult<Prisma.$ClientRelationshipPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the RelationshipNote model
   */ 
  interface RelationshipNoteFieldRefs {
    readonly id: FieldRef<"RelationshipNote", 'String'>
    readonly relationshipId: FieldRef<"RelationshipNote", 'String'>
    readonly noteType: FieldRef<"RelationshipNote", 'NoteType'>
    readonly content: FieldRef<"RelationshipNote", 'String'>
    readonly createdById: FieldRef<"RelationshipNote", 'String'>
    readonly createdAt: FieldRef<"RelationshipNote", 'DateTime'>
    readonly updatedAt: FieldRef<"RelationshipNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RelationshipNote findUnique
   */
  export type RelationshipNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter, which RelationshipNote to fetch.
     */
    where: RelationshipNoteWhereUniqueInput
  }

  /**
   * RelationshipNote findUniqueOrThrow
   */
  export type RelationshipNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter, which RelationshipNote to fetch.
     */
    where: RelationshipNoteWhereUniqueInput
  }

  /**
   * RelationshipNote findFirst
   */
  export type RelationshipNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter, which RelationshipNote to fetch.
     */
    where?: RelationshipNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelationshipNotes to fetch.
     */
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelationshipNotes.
     */
    cursor?: RelationshipNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelationshipNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelationshipNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelationshipNotes.
     */
    distinct?: RelationshipNoteScalarFieldEnum | RelationshipNoteScalarFieldEnum[]
  }

  /**
   * RelationshipNote findFirstOrThrow
   */
  export type RelationshipNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter, which RelationshipNote to fetch.
     */
    where?: RelationshipNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelationshipNotes to fetch.
     */
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RelationshipNotes.
     */
    cursor?: RelationshipNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelationshipNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelationshipNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RelationshipNotes.
     */
    distinct?: RelationshipNoteScalarFieldEnum | RelationshipNoteScalarFieldEnum[]
  }

  /**
   * RelationshipNote findMany
   */
  export type RelationshipNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter, which RelationshipNotes to fetch.
     */
    where?: RelationshipNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RelationshipNotes to fetch.
     */
    orderBy?: RelationshipNoteOrderByWithRelationInput | RelationshipNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RelationshipNotes.
     */
    cursor?: RelationshipNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RelationshipNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RelationshipNotes.
     */
    skip?: number
    distinct?: RelationshipNoteScalarFieldEnum | RelationshipNoteScalarFieldEnum[]
  }

  /**
   * RelationshipNote create
   */
  export type RelationshipNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * The data needed to create a RelationshipNote.
     */
    data: XOR<RelationshipNoteCreateInput, RelationshipNoteUncheckedCreateInput>
  }

  /**
   * RelationshipNote createMany
   */
  export type RelationshipNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RelationshipNotes.
     */
    data: RelationshipNoteCreateManyInput | RelationshipNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RelationshipNote createManyAndReturn
   */
  export type RelationshipNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many RelationshipNotes.
     */
    data: RelationshipNoteCreateManyInput | RelationshipNoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RelationshipNote update
   */
  export type RelationshipNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * The data needed to update a RelationshipNote.
     */
    data: XOR<RelationshipNoteUpdateInput, RelationshipNoteUncheckedUpdateInput>
    /**
     * Choose, which RelationshipNote to update.
     */
    where: RelationshipNoteWhereUniqueInput
  }

  /**
   * RelationshipNote updateMany
   */
  export type RelationshipNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RelationshipNotes.
     */
    data: XOR<RelationshipNoteUpdateManyMutationInput, RelationshipNoteUncheckedUpdateManyInput>
    /**
     * Filter which RelationshipNotes to update
     */
    where?: RelationshipNoteWhereInput
  }

  /**
   * RelationshipNote upsert
   */
  export type RelationshipNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * The filter to search for the RelationshipNote to update in case it exists.
     */
    where: RelationshipNoteWhereUniqueInput
    /**
     * In case the RelationshipNote found by the `where` argument doesn't exist, create a new RelationshipNote with this data.
     */
    create: XOR<RelationshipNoteCreateInput, RelationshipNoteUncheckedCreateInput>
    /**
     * In case the RelationshipNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RelationshipNoteUpdateInput, RelationshipNoteUncheckedUpdateInput>
  }

  /**
   * RelationshipNote delete
   */
  export type RelationshipNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
    /**
     * Filter which RelationshipNote to delete.
     */
    where: RelationshipNoteWhereUniqueInput
  }

  /**
   * RelationshipNote deleteMany
   */
  export type RelationshipNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RelationshipNotes to delete
     */
    where?: RelationshipNoteWhereInput
  }

  /**
   * RelationshipNote without action
   */
  export type RelationshipNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RelationshipNote
     */
    select?: RelationshipNoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RelationshipNoteInclude<ExtArgs> | null
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


  export const BusinessScalarFieldEnum: {
    id: 'id',
    name: 'name',
    type: 'type',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    address: 'address',
    phone: 'phone',
    email: 'email',
    settings: 'settings'
  };

  export type BusinessScalarFieldEnum = (typeof BusinessScalarFieldEnum)[keyof typeof BusinessScalarFieldEnum]


  export const StaffScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId'
  };

  export type StaffScalarFieldEnum = (typeof StaffScalarFieldEnum)[keyof typeof StaffScalarFieldEnum]


  export const ServiceCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId'
  };

  export type ServiceCategoryScalarFieldEnum = (typeof ServiceCategoryScalarFieldEnum)[keyof typeof ServiceCategoryScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const ClientSensitiveInfoScalarFieldEnum: {
    id: 'id',
    email: 'email',
    notes: 'notes',
    medicalInfo: 'medicalInfo',
    documents: 'documents',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    clientId: 'clientId',
    encryptionStatus: 'encryptionStatus',
    lastAccessedAt: 'lastAccessedAt',
    accessLog: 'accessLog'
  };

  export type ClientSensitiveInfoScalarFieldEnum = (typeof ClientSensitiveInfoScalarFieldEnum)[keyof typeof ClientSensitiveInfoScalarFieldEnum]


  export const ServiceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    duration: 'duration',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId',
    categoryId: 'categoryId'
  };

  export type ServiceScalarFieldEnum = (typeof ServiceScalarFieldEnum)[keyof typeof ServiceScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId',
    clientId: 'clientId',
    serviceId: 'serviceId',
    staffId: 'staffId'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    amount: 'amount',
    status: 'status',
    paymentMethod: 'paymentMethod',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    appointmentId: 'appointmentId'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const ScheduleScalarFieldEnum: {
    id: 'id',
    dayOfWeek: 'dayOfWeek',
    startTime: 'startTime',
    endTime: 'endTime',
    staffId: 'staffId'
  };

  export type ScheduleScalarFieldEnum = (typeof ScheduleScalarFieldEnum)[keyof typeof ScheduleScalarFieldEnum]


  export const BusinessHoursScalarFieldEnum: {
    id: 'id',
    dayOfWeek: 'dayOfWeek',
    startTime: 'startTime',
    endTime: 'endTime',
    isClosed: 'isClosed',
    businessId: 'businessId'
  };

  export type BusinessHoursScalarFieldEnum = (typeof BusinessHoursScalarFieldEnum)[keyof typeof BusinessHoursScalarFieldEnum]


  export const ClientRelationshipScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    businessId: 'businessId',
    status: 'status',
    relationshipStartDate: 'relationshipStartDate',
    lastVisit: 'lastVisit',
    visitFrequency: 'visitFrequency',
    lifetimeValue: 'lifetimeValue',
    preferences: 'preferences',
    internalNotes: 'internalNotes',
    flags: 'flags',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClientRelationshipScalarFieldEnum = (typeof ClientRelationshipScalarFieldEnum)[keyof typeof ClientRelationshipScalarFieldEnum]


  export const VisitHistoryScalarFieldEnum: {
    id: 'id',
    relationshipId: 'relationshipId',
    visitDate: 'visitDate',
    serviceType: 'serviceType',
    staffNotes: 'staffNotes',
    clientFeedback: 'clientFeedback',
    followUpRequired: 'followUpRequired',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VisitHistoryScalarFieldEnum = (typeof VisitHistoryScalarFieldEnum)[keyof typeof VisitHistoryScalarFieldEnum]


  export const RelationshipNoteScalarFieldEnum: {
    id: 'id',
    relationshipId: 'relationshipId',
    noteType: 'noteType',
    content: 'content',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RelationshipNoteScalarFieldEnum = (typeof RelationshipNoteScalarFieldEnum)[keyof typeof RelationshipNoteScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BusinessType'
   */
  export type EnumBusinessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BusinessType'>
    


  /**
   * Reference to a field of type 'BusinessType[]'
   */
  export type ListEnumBusinessTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BusinessType[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'StaffRole'
   */
  export type EnumStaffRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StaffRole'>
    


  /**
   * Reference to a field of type 'StaffRole[]'
   */
  export type ListEnumStaffRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StaffRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'AppointmentStatus'
   */
  export type EnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus'>
    


  /**
   * Reference to a field of type 'AppointmentStatus[]'
   */
  export type ListEnumAppointmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AppointmentStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'ClientStatus'
   */
  export type EnumClientStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientStatus'>
    


  /**
   * Reference to a field of type 'ClientStatus[]'
   */
  export type ListEnumClientStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientStatus[]'>
    


  /**
   * Reference to a field of type 'ClientFlag[]'
   */
  export type ListEnumClientFlagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientFlag[]'>
    


  /**
   * Reference to a field of type 'ClientFlag'
   */
  export type EnumClientFlagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientFlag'>
    


  /**
   * Reference to a field of type 'NoteType'
   */
  export type EnumNoteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NoteType'>
    


  /**
   * Reference to a field of type 'NoteType[]'
   */
  export type ListEnumNoteTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NoteType[]'>
    


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


  export type BusinessWhereInput = {
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    id?: StringFilter<"Business"> | string
    name?: StringFilter<"Business"> | string
    type?: EnumBusinessTypeFilter<"Business"> | $Enums.BusinessType
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    address?: StringNullableFilter<"Business"> | string | null
    phone?: StringNullableFilter<"Business"> | string | null
    email?: StringFilter<"Business"> | string
    settings?: JsonNullableFilter<"Business">
    appointments?: AppointmentListRelationFilter
    businessHours?: BusinessHoursListRelationFilter
    clientRelationships?: ClientRelationshipListRelationFilter
    clients?: ClientListRelationFilter
    categories?: ServiceCategoryListRelationFilter
    services?: ServiceListRelationFilter
    staff?: StaffListRelationFilter
  }

  export type BusinessOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrder
    settings?: SortOrderInput | SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    businessHours?: BusinessHoursOrderByRelationAggregateInput
    clientRelationships?: ClientRelationshipOrderByRelationAggregateInput
    clients?: ClientOrderByRelationAggregateInput
    categories?: ServiceCategoryOrderByRelationAggregateInput
    services?: ServiceOrderByRelationAggregateInput
    staff?: StaffOrderByRelationAggregateInput
  }

  export type BusinessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    name?: StringFilter<"Business"> | string
    type?: EnumBusinessTypeFilter<"Business"> | $Enums.BusinessType
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    address?: StringNullableFilter<"Business"> | string | null
    phone?: StringNullableFilter<"Business"> | string | null
    settings?: JsonNullableFilter<"Business">
    appointments?: AppointmentListRelationFilter
    businessHours?: BusinessHoursListRelationFilter
    clientRelationships?: ClientRelationshipListRelationFilter
    clients?: ClientListRelationFilter
    categories?: ServiceCategoryListRelationFilter
    services?: ServiceListRelationFilter
    staff?: StaffListRelationFilter
  }, "id" | "email">

  export type BusinessOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrder
    settings?: SortOrderInput | SortOrder
    _count?: BusinessCountOrderByAggregateInput
    _max?: BusinessMaxOrderByAggregateInput
    _min?: BusinessMinOrderByAggregateInput
  }

  export type BusinessScalarWhereWithAggregatesInput = {
    AND?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    OR?: BusinessScalarWhereWithAggregatesInput[]
    NOT?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Business"> | string
    name?: StringWithAggregatesFilter<"Business"> | string
    type?: EnumBusinessTypeWithAggregatesFilter<"Business"> | $Enums.BusinessType
    createdAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    address?: StringNullableWithAggregatesFilter<"Business"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Business"> | string | null
    email?: StringWithAggregatesFilter<"Business"> | string
    settings?: JsonNullableWithAggregatesFilter<"Business">
  }

  export type StaffWhereInput = {
    AND?: StaffWhereInput | StaffWhereInput[]
    OR?: StaffWhereInput[]
    NOT?: StaffWhereInput | StaffWhereInput[]
    id?: StringFilter<"Staff"> | string
    email?: StringFilter<"Staff"> | string
    name?: StringFilter<"Staff"> | string
    role?: EnumStaffRoleFilter<"Staff"> | $Enums.StaffRole
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
    businessId?: StringFilter<"Staff"> | string
    appointments?: AppointmentListRelationFilter
    relationshipNotes?: RelationshipNoteListRelationFilter
    schedules?: ScheduleListRelationFilter
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    preferredByClients?: ClientRelationshipListRelationFilter
    services?: ServiceListRelationFilter
  }

  export type StaffOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    relationshipNotes?: RelationshipNoteOrderByRelationAggregateInput
    schedules?: ScheduleOrderByRelationAggregateInput
    business?: BusinessOrderByWithRelationInput
    preferredByClients?: ClientRelationshipOrderByRelationAggregateInput
    services?: ServiceOrderByRelationAggregateInput
  }

  export type StaffWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: StaffWhereInput | StaffWhereInput[]
    OR?: StaffWhereInput[]
    NOT?: StaffWhereInput | StaffWhereInput[]
    name?: StringFilter<"Staff"> | string
    role?: EnumStaffRoleFilter<"Staff"> | $Enums.StaffRole
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
    businessId?: StringFilter<"Staff"> | string
    appointments?: AppointmentListRelationFilter
    relationshipNotes?: RelationshipNoteListRelationFilter
    schedules?: ScheduleListRelationFilter
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    preferredByClients?: ClientRelationshipListRelationFilter
    services?: ServiceListRelationFilter
  }, "id" | "email">

  export type StaffOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    _count?: StaffCountOrderByAggregateInput
    _max?: StaffMaxOrderByAggregateInput
    _min?: StaffMinOrderByAggregateInput
  }

  export type StaffScalarWhereWithAggregatesInput = {
    AND?: StaffScalarWhereWithAggregatesInput | StaffScalarWhereWithAggregatesInput[]
    OR?: StaffScalarWhereWithAggregatesInput[]
    NOT?: StaffScalarWhereWithAggregatesInput | StaffScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Staff"> | string
    email?: StringWithAggregatesFilter<"Staff"> | string
    name?: StringWithAggregatesFilter<"Staff"> | string
    role?: EnumStaffRoleWithAggregatesFilter<"Staff"> | $Enums.StaffRole
    createdAt?: DateTimeWithAggregatesFilter<"Staff"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Staff"> | Date | string
    businessId?: StringWithAggregatesFilter<"Staff"> | string
  }

  export type ServiceCategoryWhereInput = {
    AND?: ServiceCategoryWhereInput | ServiceCategoryWhereInput[]
    OR?: ServiceCategoryWhereInput[]
    NOT?: ServiceCategoryWhereInput | ServiceCategoryWhereInput[]
    id?: StringFilter<"ServiceCategory"> | string
    name?: StringFilter<"ServiceCategory"> | string
    description?: StringNullableFilter<"ServiceCategory"> | string | null
    color?: StringNullableFilter<"ServiceCategory"> | string | null
    createdAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    businessId?: StringFilter<"ServiceCategory"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    services?: ServiceListRelationFilter
  }

  export type ServiceCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    business?: BusinessOrderByWithRelationInput
    services?: ServiceOrderByRelationAggregateInput
  }

  export type ServiceCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceCategoryWhereInput | ServiceCategoryWhereInput[]
    OR?: ServiceCategoryWhereInput[]
    NOT?: ServiceCategoryWhereInput | ServiceCategoryWhereInput[]
    name?: StringFilter<"ServiceCategory"> | string
    description?: StringNullableFilter<"ServiceCategory"> | string | null
    color?: StringNullableFilter<"ServiceCategory"> | string | null
    createdAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    businessId?: StringFilter<"ServiceCategory"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    services?: ServiceListRelationFilter
  }, "id">

  export type ServiceCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    color?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    _count?: ServiceCategoryCountOrderByAggregateInput
    _max?: ServiceCategoryMaxOrderByAggregateInput
    _min?: ServiceCategoryMinOrderByAggregateInput
  }

  export type ServiceCategoryScalarWhereWithAggregatesInput = {
    AND?: ServiceCategoryScalarWhereWithAggregatesInput | ServiceCategoryScalarWhereWithAggregatesInput[]
    OR?: ServiceCategoryScalarWhereWithAggregatesInput[]
    NOT?: ServiceCategoryScalarWhereWithAggregatesInput | ServiceCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServiceCategory"> | string
    name?: StringWithAggregatesFilter<"ServiceCategory"> | string
    description?: StringNullableWithAggregatesFilter<"ServiceCategory"> | string | null
    color?: StringNullableWithAggregatesFilter<"ServiceCategory"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ServiceCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ServiceCategory"> | Date | string
    businessId?: StringWithAggregatesFilter<"ServiceCategory"> | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    businessId?: StringFilter<"Client"> | string
    appointments?: AppointmentListRelationFilter
    relationship?: XOR<ClientRelationshipNullableRelationFilter, ClientRelationshipWhereInput> | null
    sensitiveInfo?: XOR<ClientSensitiveInfoNullableRelationFilter, ClientSensitiveInfoWhereInput> | null
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    relationship?: ClientRelationshipOrderByWithRelationInput
    sensitiveInfo?: ClientSensitiveInfoOrderByWithRelationInput
    business?: BusinessOrderByWithRelationInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    name?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    businessId?: StringFilter<"Client"> | string
    appointments?: AppointmentListRelationFilter
    relationship?: XOR<ClientRelationshipNullableRelationFilter, ClientRelationshipWhereInput> | null
    sensitiveInfo?: XOR<ClientSensitiveInfoNullableRelationFilter, ClientSensitiveInfoWhereInput> | null
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }, "id">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    name?: StringWithAggregatesFilter<"Client"> | string
    phone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    businessId?: StringWithAggregatesFilter<"Client"> | string
  }

  export type ClientSensitiveInfoWhereInput = {
    AND?: ClientSensitiveInfoWhereInput | ClientSensitiveInfoWhereInput[]
    OR?: ClientSensitiveInfoWhereInput[]
    NOT?: ClientSensitiveInfoWhereInput | ClientSensitiveInfoWhereInput[]
    id?: StringFilter<"ClientSensitiveInfo"> | string
    email?: StringFilter<"ClientSensitiveInfo"> | string
    notes?: StringNullableFilter<"ClientSensitiveInfo"> | string | null
    medicalInfo?: StringNullableFilter<"ClientSensitiveInfo"> | string | null
    documents?: JsonNullableFilter<"ClientSensitiveInfo">
    createdAt?: DateTimeFilter<"ClientSensitiveInfo"> | Date | string
    updatedAt?: DateTimeFilter<"ClientSensitiveInfo"> | Date | string
    clientId?: StringFilter<"ClientSensitiveInfo"> | string
    encryptionStatus?: BoolFilter<"ClientSensitiveInfo"> | boolean
    lastAccessedAt?: DateTimeNullableFilter<"ClientSensitiveInfo"> | Date | string | null
    accessLog?: JsonNullableFilter<"ClientSensitiveInfo">
    client?: XOR<ClientRelationFilter, ClientWhereInput>
  }

  export type ClientSensitiveInfoOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    notes?: SortOrderInput | SortOrder
    medicalInfo?: SortOrderInput | SortOrder
    documents?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientId?: SortOrder
    encryptionStatus?: SortOrder
    lastAccessedAt?: SortOrderInput | SortOrder
    accessLog?: SortOrderInput | SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type ClientSensitiveInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clientId?: string
    AND?: ClientSensitiveInfoWhereInput | ClientSensitiveInfoWhereInput[]
    OR?: ClientSensitiveInfoWhereInput[]
    NOT?: ClientSensitiveInfoWhereInput | ClientSensitiveInfoWhereInput[]
    email?: StringFilter<"ClientSensitiveInfo"> | string
    notes?: StringNullableFilter<"ClientSensitiveInfo"> | string | null
    medicalInfo?: StringNullableFilter<"ClientSensitiveInfo"> | string | null
    documents?: JsonNullableFilter<"ClientSensitiveInfo">
    createdAt?: DateTimeFilter<"ClientSensitiveInfo"> | Date | string
    updatedAt?: DateTimeFilter<"ClientSensitiveInfo"> | Date | string
    encryptionStatus?: BoolFilter<"ClientSensitiveInfo"> | boolean
    lastAccessedAt?: DateTimeNullableFilter<"ClientSensitiveInfo"> | Date | string | null
    accessLog?: JsonNullableFilter<"ClientSensitiveInfo">
    client?: XOR<ClientRelationFilter, ClientWhereInput>
  }, "id" | "clientId">

  export type ClientSensitiveInfoOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    notes?: SortOrderInput | SortOrder
    medicalInfo?: SortOrderInput | SortOrder
    documents?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientId?: SortOrder
    encryptionStatus?: SortOrder
    lastAccessedAt?: SortOrderInput | SortOrder
    accessLog?: SortOrderInput | SortOrder
    _count?: ClientSensitiveInfoCountOrderByAggregateInput
    _max?: ClientSensitiveInfoMaxOrderByAggregateInput
    _min?: ClientSensitiveInfoMinOrderByAggregateInput
  }

  export type ClientSensitiveInfoScalarWhereWithAggregatesInput = {
    AND?: ClientSensitiveInfoScalarWhereWithAggregatesInput | ClientSensitiveInfoScalarWhereWithAggregatesInput[]
    OR?: ClientSensitiveInfoScalarWhereWithAggregatesInput[]
    NOT?: ClientSensitiveInfoScalarWhereWithAggregatesInput | ClientSensitiveInfoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClientSensitiveInfo"> | string
    email?: StringWithAggregatesFilter<"ClientSensitiveInfo"> | string
    notes?: StringNullableWithAggregatesFilter<"ClientSensitiveInfo"> | string | null
    medicalInfo?: StringNullableWithAggregatesFilter<"ClientSensitiveInfo"> | string | null
    documents?: JsonNullableWithAggregatesFilter<"ClientSensitiveInfo">
    createdAt?: DateTimeWithAggregatesFilter<"ClientSensitiveInfo"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClientSensitiveInfo"> | Date | string
    clientId?: StringWithAggregatesFilter<"ClientSensitiveInfo"> | string
    encryptionStatus?: BoolWithAggregatesFilter<"ClientSensitiveInfo"> | boolean
    lastAccessedAt?: DateTimeNullableWithAggregatesFilter<"ClientSensitiveInfo"> | Date | string | null
    accessLog?: JsonNullableWithAggregatesFilter<"ClientSensitiveInfo">
  }

  export type ServiceWhereInput = {
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    id?: StringFilter<"Service"> | string
    name?: StringFilter<"Service"> | string
    description?: StringNullableFilter<"Service"> | string | null
    duration?: IntFilter<"Service"> | number
    price?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    businessId?: StringFilter<"Service"> | string
    categoryId?: StringNullableFilter<"Service"> | string | null
    appointments?: AppointmentListRelationFilter
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    category?: XOR<ServiceCategoryNullableRelationFilter, ServiceCategoryWhereInput> | null
    providers?: StaffListRelationFilter
  }

  export type ServiceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    business?: BusinessOrderByWithRelationInput
    category?: ServiceCategoryOrderByWithRelationInput
    providers?: StaffOrderByRelationAggregateInput
  }

  export type ServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    name?: StringFilter<"Service"> | string
    description?: StringNullableFilter<"Service"> | string | null
    duration?: IntFilter<"Service"> | number
    price?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    businessId?: StringFilter<"Service"> | string
    categoryId?: StringNullableFilter<"Service"> | string | null
    appointments?: AppointmentListRelationFilter
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    category?: XOR<ServiceCategoryNullableRelationFilter, ServiceCategoryWhereInput> | null
    providers?: StaffListRelationFilter
  }, "id">

  export type ServiceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    _count?: ServiceCountOrderByAggregateInput
    _avg?: ServiceAvgOrderByAggregateInput
    _max?: ServiceMaxOrderByAggregateInput
    _min?: ServiceMinOrderByAggregateInput
    _sum?: ServiceSumOrderByAggregateInput
  }

  export type ServiceScalarWhereWithAggregatesInput = {
    AND?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    OR?: ServiceScalarWhereWithAggregatesInput[]
    NOT?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Service"> | string
    name?: StringWithAggregatesFilter<"Service"> | string
    description?: StringNullableWithAggregatesFilter<"Service"> | string | null
    duration?: IntWithAggregatesFilter<"Service"> | number
    price?: DecimalWithAggregatesFilter<"Service"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
    businessId?: StringWithAggregatesFilter<"Service"> | string
    categoryId?: StringNullableWithAggregatesFilter<"Service"> | string | null
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    businessId?: StringFilter<"Appointment"> | string
    clientId?: StringFilter<"Appointment"> | string
    serviceId?: StringFilter<"Appointment"> | string
    staffId?: StringFilter<"Appointment"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    client?: XOR<ClientRelationFilter, ClientWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    staff?: XOR<StaffRelationFilter, StaffWhereInput>
    payment?: XOR<PaymentNullableRelationFilter, PaymentWhereInput> | null
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    clientId?: SortOrder
    serviceId?: SortOrder
    staffId?: SortOrder
    business?: BusinessOrderByWithRelationInput
    client?: ClientOrderByWithRelationInput
    service?: ServiceOrderByWithRelationInput
    staff?: StaffOrderByWithRelationInput
    payment?: PaymentOrderByWithRelationInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    businessId?: StringFilter<"Appointment"> | string
    clientId?: StringFilter<"Appointment"> | string
    serviceId?: StringFilter<"Appointment"> | string
    staffId?: StringFilter<"Appointment"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    client?: XOR<ClientRelationFilter, ClientWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    staff?: XOR<StaffRelationFilter, StaffWhereInput>
    payment?: XOR<PaymentNullableRelationFilter, PaymentWhereInput> | null
  }, "id">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    clientId?: SortOrder
    serviceId?: SortOrder
    staffId?: SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    startTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusWithAggregatesFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    businessId?: StringWithAggregatesFilter<"Appointment"> | string
    clientId?: StringWithAggregatesFilter<"Appointment"> | string
    serviceId?: StringWithAggregatesFilter<"Appointment"> | string
    staffId?: StringWithAggregatesFilter<"Appointment"> | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    appointmentId?: StringFilter<"Payment"> | string
    appointment?: XOR<AppointmentRelationFilter, AppointmentWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentId?: SortOrder
    appointment?: AppointmentOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    appointmentId?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    appointment?: XOR<AppointmentRelationFilter, AppointmentWhereInput>
  }, "id" | "appointmentId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentId?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodWithAggregatesFilter<"Payment"> | $Enums.PaymentMethod
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    appointmentId?: StringWithAggregatesFilter<"Payment"> | string
  }

  export type ScheduleWhereInput = {
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    id?: StringFilter<"Schedule"> | string
    dayOfWeek?: IntFilter<"Schedule"> | number
    startTime?: StringFilter<"Schedule"> | string
    endTime?: StringFilter<"Schedule"> | string
    staffId?: StringFilter<"Schedule"> | string
    staff?: XOR<StaffRelationFilter, StaffWhereInput>
  }

  export type ScheduleOrderByWithRelationInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    staffId?: SortOrder
    staff?: StaffOrderByWithRelationInput
  }

  export type ScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    dayOfWeek?: IntFilter<"Schedule"> | number
    startTime?: StringFilter<"Schedule"> | string
    endTime?: StringFilter<"Schedule"> | string
    staffId?: StringFilter<"Schedule"> | string
    staff?: XOR<StaffRelationFilter, StaffWhereInput>
  }, "id">

  export type ScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    staffId?: SortOrder
    _count?: ScheduleCountOrderByAggregateInput
    _avg?: ScheduleAvgOrderByAggregateInput
    _max?: ScheduleMaxOrderByAggregateInput
    _min?: ScheduleMinOrderByAggregateInput
    _sum?: ScheduleSumOrderByAggregateInput
  }

  export type ScheduleScalarWhereWithAggregatesInput = {
    AND?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    OR?: ScheduleScalarWhereWithAggregatesInput[]
    NOT?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Schedule"> | string
    dayOfWeek?: IntWithAggregatesFilter<"Schedule"> | number
    startTime?: StringWithAggregatesFilter<"Schedule"> | string
    endTime?: StringWithAggregatesFilter<"Schedule"> | string
    staffId?: StringWithAggregatesFilter<"Schedule"> | string
  }

  export type BusinessHoursWhereInput = {
    AND?: BusinessHoursWhereInput | BusinessHoursWhereInput[]
    OR?: BusinessHoursWhereInput[]
    NOT?: BusinessHoursWhereInput | BusinessHoursWhereInput[]
    id?: StringFilter<"BusinessHours"> | string
    dayOfWeek?: IntFilter<"BusinessHours"> | number
    startTime?: StringFilter<"BusinessHours"> | string
    endTime?: StringFilter<"BusinessHours"> | string
    isClosed?: BoolFilter<"BusinessHours"> | boolean
    businessId?: StringFilter<"BusinessHours"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }

  export type BusinessHoursOrderByWithRelationInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isClosed?: SortOrder
    businessId?: SortOrder
    business?: BusinessOrderByWithRelationInput
  }

  export type BusinessHoursWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BusinessHoursWhereInput | BusinessHoursWhereInput[]
    OR?: BusinessHoursWhereInput[]
    NOT?: BusinessHoursWhereInput | BusinessHoursWhereInput[]
    dayOfWeek?: IntFilter<"BusinessHours"> | number
    startTime?: StringFilter<"BusinessHours"> | string
    endTime?: StringFilter<"BusinessHours"> | string
    isClosed?: BoolFilter<"BusinessHours"> | boolean
    businessId?: StringFilter<"BusinessHours"> | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
  }, "id">

  export type BusinessHoursOrderByWithAggregationInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isClosed?: SortOrder
    businessId?: SortOrder
    _count?: BusinessHoursCountOrderByAggregateInput
    _avg?: BusinessHoursAvgOrderByAggregateInput
    _max?: BusinessHoursMaxOrderByAggregateInput
    _min?: BusinessHoursMinOrderByAggregateInput
    _sum?: BusinessHoursSumOrderByAggregateInput
  }

  export type BusinessHoursScalarWhereWithAggregatesInput = {
    AND?: BusinessHoursScalarWhereWithAggregatesInput | BusinessHoursScalarWhereWithAggregatesInput[]
    OR?: BusinessHoursScalarWhereWithAggregatesInput[]
    NOT?: BusinessHoursScalarWhereWithAggregatesInput | BusinessHoursScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BusinessHours"> | string
    dayOfWeek?: IntWithAggregatesFilter<"BusinessHours"> | number
    startTime?: StringWithAggregatesFilter<"BusinessHours"> | string
    endTime?: StringWithAggregatesFilter<"BusinessHours"> | string
    isClosed?: BoolWithAggregatesFilter<"BusinessHours"> | boolean
    businessId?: StringWithAggregatesFilter<"BusinessHours"> | string
  }

  export type ClientRelationshipWhereInput = {
    AND?: ClientRelationshipWhereInput | ClientRelationshipWhereInput[]
    OR?: ClientRelationshipWhereInput[]
    NOT?: ClientRelationshipWhereInput | ClientRelationshipWhereInput[]
    id?: StringFilter<"ClientRelationship"> | string
    clientId?: StringFilter<"ClientRelationship"> | string
    businessId?: StringFilter<"ClientRelationship"> | string
    status?: EnumClientStatusFilter<"ClientRelationship"> | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFilter<"ClientRelationship"> | Date | string
    lastVisit?: DateTimeNullableFilter<"ClientRelationship"> | Date | string | null
    visitFrequency?: IntNullableFilter<"ClientRelationship"> | number | null
    lifetimeValue?: DecimalNullableFilter<"ClientRelationship"> | Decimal | DecimalJsLike | number | string | null
    preferences?: JsonNullableFilter<"ClientRelationship">
    internalNotes?: StringNullableFilter<"ClientRelationship"> | string | null
    flags?: EnumClientFlagNullableListFilter<"ClientRelationship">
    createdAt?: DateTimeFilter<"ClientRelationship"> | Date | string
    updatedAt?: DateTimeFilter<"ClientRelationship"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    client?: XOR<ClientRelationFilter, ClientWhereInput>
    noteHistory?: RelationshipNoteListRelationFilter
    visitHistory?: VisitHistoryListRelationFilter
    preferredStaff?: StaffListRelationFilter
  }

  export type ClientRelationshipOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    relationshipStartDate?: SortOrder
    lastVisit?: SortOrderInput | SortOrder
    visitFrequency?: SortOrderInput | SortOrder
    lifetimeValue?: SortOrderInput | SortOrder
    preferences?: SortOrderInput | SortOrder
    internalNotes?: SortOrderInput | SortOrder
    flags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    client?: ClientOrderByWithRelationInput
    noteHistory?: RelationshipNoteOrderByRelationAggregateInput
    visitHistory?: VisitHistoryOrderByRelationAggregateInput
    preferredStaff?: StaffOrderByRelationAggregateInput
  }

  export type ClientRelationshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    clientId?: string
    AND?: ClientRelationshipWhereInput | ClientRelationshipWhereInput[]
    OR?: ClientRelationshipWhereInput[]
    NOT?: ClientRelationshipWhereInput | ClientRelationshipWhereInput[]
    businessId?: StringFilter<"ClientRelationship"> | string
    status?: EnumClientStatusFilter<"ClientRelationship"> | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFilter<"ClientRelationship"> | Date | string
    lastVisit?: DateTimeNullableFilter<"ClientRelationship"> | Date | string | null
    visitFrequency?: IntNullableFilter<"ClientRelationship"> | number | null
    lifetimeValue?: DecimalNullableFilter<"ClientRelationship"> | Decimal | DecimalJsLike | number | string | null
    preferences?: JsonNullableFilter<"ClientRelationship">
    internalNotes?: StringNullableFilter<"ClientRelationship"> | string | null
    flags?: EnumClientFlagNullableListFilter<"ClientRelationship">
    createdAt?: DateTimeFilter<"ClientRelationship"> | Date | string
    updatedAt?: DateTimeFilter<"ClientRelationship"> | Date | string
    business?: XOR<BusinessRelationFilter, BusinessWhereInput>
    client?: XOR<ClientRelationFilter, ClientWhereInput>
    noteHistory?: RelationshipNoteListRelationFilter
    visitHistory?: VisitHistoryListRelationFilter
    preferredStaff?: StaffListRelationFilter
  }, "id" | "clientId">

  export type ClientRelationshipOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    relationshipStartDate?: SortOrder
    lastVisit?: SortOrderInput | SortOrder
    visitFrequency?: SortOrderInput | SortOrder
    lifetimeValue?: SortOrderInput | SortOrder
    preferences?: SortOrderInput | SortOrder
    internalNotes?: SortOrderInput | SortOrder
    flags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientRelationshipCountOrderByAggregateInput
    _avg?: ClientRelationshipAvgOrderByAggregateInput
    _max?: ClientRelationshipMaxOrderByAggregateInput
    _min?: ClientRelationshipMinOrderByAggregateInput
    _sum?: ClientRelationshipSumOrderByAggregateInput
  }

  export type ClientRelationshipScalarWhereWithAggregatesInput = {
    AND?: ClientRelationshipScalarWhereWithAggregatesInput | ClientRelationshipScalarWhereWithAggregatesInput[]
    OR?: ClientRelationshipScalarWhereWithAggregatesInput[]
    NOT?: ClientRelationshipScalarWhereWithAggregatesInput | ClientRelationshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClientRelationship"> | string
    clientId?: StringWithAggregatesFilter<"ClientRelationship"> | string
    businessId?: StringWithAggregatesFilter<"ClientRelationship"> | string
    status?: EnumClientStatusWithAggregatesFilter<"ClientRelationship"> | $Enums.ClientStatus
    relationshipStartDate?: DateTimeWithAggregatesFilter<"ClientRelationship"> | Date | string
    lastVisit?: DateTimeNullableWithAggregatesFilter<"ClientRelationship"> | Date | string | null
    visitFrequency?: IntNullableWithAggregatesFilter<"ClientRelationship"> | number | null
    lifetimeValue?: DecimalNullableWithAggregatesFilter<"ClientRelationship"> | Decimal | DecimalJsLike | number | string | null
    preferences?: JsonNullableWithAggregatesFilter<"ClientRelationship">
    internalNotes?: StringNullableWithAggregatesFilter<"ClientRelationship"> | string | null
    flags?: EnumClientFlagNullableListFilter<"ClientRelationship">
    createdAt?: DateTimeWithAggregatesFilter<"ClientRelationship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClientRelationship"> | Date | string
  }

  export type VisitHistoryWhereInput = {
    AND?: VisitHistoryWhereInput | VisitHistoryWhereInput[]
    OR?: VisitHistoryWhereInput[]
    NOT?: VisitHistoryWhereInput | VisitHistoryWhereInput[]
    id?: StringFilter<"VisitHistory"> | string
    relationshipId?: StringFilter<"VisitHistory"> | string
    visitDate?: DateTimeFilter<"VisitHistory"> | Date | string
    serviceType?: StringFilter<"VisitHistory"> | string
    staffNotes?: StringNullableFilter<"VisitHistory"> | string | null
    clientFeedback?: StringNullableFilter<"VisitHistory"> | string | null
    followUpRequired?: BoolFilter<"VisitHistory"> | boolean
    createdAt?: DateTimeFilter<"VisitHistory"> | Date | string
    updatedAt?: DateTimeFilter<"VisitHistory"> | Date | string
    clientRelationship?: XOR<ClientRelationshipRelationFilter, ClientRelationshipWhereInput>
  }

  export type VisitHistoryOrderByWithRelationInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    visitDate?: SortOrder
    serviceType?: SortOrder
    staffNotes?: SortOrderInput | SortOrder
    clientFeedback?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientRelationship?: ClientRelationshipOrderByWithRelationInput
  }

  export type VisitHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VisitHistoryWhereInput | VisitHistoryWhereInput[]
    OR?: VisitHistoryWhereInput[]
    NOT?: VisitHistoryWhereInput | VisitHistoryWhereInput[]
    relationshipId?: StringFilter<"VisitHistory"> | string
    visitDate?: DateTimeFilter<"VisitHistory"> | Date | string
    serviceType?: StringFilter<"VisitHistory"> | string
    staffNotes?: StringNullableFilter<"VisitHistory"> | string | null
    clientFeedback?: StringNullableFilter<"VisitHistory"> | string | null
    followUpRequired?: BoolFilter<"VisitHistory"> | boolean
    createdAt?: DateTimeFilter<"VisitHistory"> | Date | string
    updatedAt?: DateTimeFilter<"VisitHistory"> | Date | string
    clientRelationship?: XOR<ClientRelationshipRelationFilter, ClientRelationshipWhereInput>
  }, "id">

  export type VisitHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    visitDate?: SortOrder
    serviceType?: SortOrder
    staffNotes?: SortOrderInput | SortOrder
    clientFeedback?: SortOrderInput | SortOrder
    followUpRequired?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VisitHistoryCountOrderByAggregateInput
    _max?: VisitHistoryMaxOrderByAggregateInput
    _min?: VisitHistoryMinOrderByAggregateInput
  }

  export type VisitHistoryScalarWhereWithAggregatesInput = {
    AND?: VisitHistoryScalarWhereWithAggregatesInput | VisitHistoryScalarWhereWithAggregatesInput[]
    OR?: VisitHistoryScalarWhereWithAggregatesInput[]
    NOT?: VisitHistoryScalarWhereWithAggregatesInput | VisitHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VisitHistory"> | string
    relationshipId?: StringWithAggregatesFilter<"VisitHistory"> | string
    visitDate?: DateTimeWithAggregatesFilter<"VisitHistory"> | Date | string
    serviceType?: StringWithAggregatesFilter<"VisitHistory"> | string
    staffNotes?: StringNullableWithAggregatesFilter<"VisitHistory"> | string | null
    clientFeedback?: StringNullableWithAggregatesFilter<"VisitHistory"> | string | null
    followUpRequired?: BoolWithAggregatesFilter<"VisitHistory"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"VisitHistory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VisitHistory"> | Date | string
  }

  export type RelationshipNoteWhereInput = {
    AND?: RelationshipNoteWhereInput | RelationshipNoteWhereInput[]
    OR?: RelationshipNoteWhereInput[]
    NOT?: RelationshipNoteWhereInput | RelationshipNoteWhereInput[]
    id?: StringFilter<"RelationshipNote"> | string
    relationshipId?: StringFilter<"RelationshipNote"> | string
    noteType?: EnumNoteTypeFilter<"RelationshipNote"> | $Enums.NoteType
    content?: StringFilter<"RelationshipNote"> | string
    createdById?: StringFilter<"RelationshipNote"> | string
    createdAt?: DateTimeFilter<"RelationshipNote"> | Date | string
    updatedAt?: DateTimeFilter<"RelationshipNote"> | Date | string
    createdBy?: XOR<StaffRelationFilter, StaffWhereInput>
    clientRelationship?: XOR<ClientRelationshipRelationFilter, ClientRelationshipWhereInput>
  }

  export type RelationshipNoteOrderByWithRelationInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: StaffOrderByWithRelationInput
    clientRelationship?: ClientRelationshipOrderByWithRelationInput
  }

  export type RelationshipNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RelationshipNoteWhereInput | RelationshipNoteWhereInput[]
    OR?: RelationshipNoteWhereInput[]
    NOT?: RelationshipNoteWhereInput | RelationshipNoteWhereInput[]
    relationshipId?: StringFilter<"RelationshipNote"> | string
    noteType?: EnumNoteTypeFilter<"RelationshipNote"> | $Enums.NoteType
    content?: StringFilter<"RelationshipNote"> | string
    createdById?: StringFilter<"RelationshipNote"> | string
    createdAt?: DateTimeFilter<"RelationshipNote"> | Date | string
    updatedAt?: DateTimeFilter<"RelationshipNote"> | Date | string
    createdBy?: XOR<StaffRelationFilter, StaffWhereInput>
    clientRelationship?: XOR<ClientRelationshipRelationFilter, ClientRelationshipWhereInput>
  }, "id">

  export type RelationshipNoteOrderByWithAggregationInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RelationshipNoteCountOrderByAggregateInput
    _max?: RelationshipNoteMaxOrderByAggregateInput
    _min?: RelationshipNoteMinOrderByAggregateInput
  }

  export type RelationshipNoteScalarWhereWithAggregatesInput = {
    AND?: RelationshipNoteScalarWhereWithAggregatesInput | RelationshipNoteScalarWhereWithAggregatesInput[]
    OR?: RelationshipNoteScalarWhereWithAggregatesInput[]
    NOT?: RelationshipNoteScalarWhereWithAggregatesInput | RelationshipNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RelationshipNote"> | string
    relationshipId?: StringWithAggregatesFilter<"RelationshipNote"> | string
    noteType?: EnumNoteTypeWithAggregatesFilter<"RelationshipNote"> | $Enums.NoteType
    content?: StringWithAggregatesFilter<"RelationshipNote"> | string
    createdById?: StringWithAggregatesFilter<"RelationshipNote"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RelationshipNote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RelationshipNote"> | Date | string
  }

  export type BusinessCreateInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateManyInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BusinessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BusinessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StaffCreateInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    business: BusinessCreateNestedOneWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type StaffCreateManyInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
  }

  export type StaffUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type ServiceCategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCategoriesInput
    services?: ServiceCreateNestedManyWithoutCategoryInput
  }

  export type ServiceCategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    services?: ServiceUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type ServiceCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCategoriesNestedInput
    services?: ServiceUpdateManyWithoutCategoryNestedInput
  }

  export type ServiceCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    services?: ServiceUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type ServiceCategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
  }

  export type ServiceCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type ClientCreateInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoCreateNestedOneWithoutClientInput
    business: BusinessCreateNestedOneWithoutClientsInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipUncheckedCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedCreateNestedOneWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUpdateOneWithoutClientNestedInput
    business?: BusinessUpdateOneRequiredWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUncheckedUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedUpdateOneWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type ClientSensitiveInfoCreateInput = {
    id?: string
    email: string
    notes?: string | null
    medicalInfo?: string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    encryptionStatus?: boolean
    lastAccessedAt?: Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
    client: ClientCreateNestedOneWithoutSensitiveInfoInput
  }

  export type ClientSensitiveInfoUncheckedCreateInput = {
    id?: string
    email: string
    notes?: string | null
    medicalInfo?: string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    clientId: string
    encryptionStatus?: boolean
    lastAccessedAt?: Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
    client?: ClientUpdateOneRequiredWithoutSensitiveInfoNestedInput
  }

  export type ClientSensitiveInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientId?: StringFieldUpdateOperationsInput | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoCreateManyInput = {
    id?: string
    email: string
    notes?: string | null
    medicalInfo?: string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    clientId: string
    encryptionStatus?: boolean
    lastAccessedAt?: Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientId?: StringFieldUpdateOperationsInput | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ServiceCreateInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutServiceInput
    business: BusinessCreateNestedOneWithoutServicesInput
    category?: ServiceCategoryCreateNestedOneWithoutServicesInput
    providers?: StaffCreateNestedManyWithoutServicesInput
  }

  export type ServiceUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    categoryId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutServiceInput
    providers?: StaffUncheckedCreateNestedManyWithoutServicesInput
  }

  export type ServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutServiceNestedInput
    business?: BusinessUpdateOneRequiredWithoutServicesNestedInput
    category?: ServiceCategoryUpdateOneWithoutServicesNestedInput
    providers?: StaffUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutServiceNestedInput
    providers?: StaffUncheckedUpdateManyWithoutServicesNestedInput
  }

  export type ServiceCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    categoryId?: string | null
  }

  export type ServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AppointmentCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAppointmentsInput
    client: ClientCreateNestedOneWithoutAppointmentsInput
    service: ServiceCreateNestedOneWithoutAppointmentsInput
    staff: StaffCreateNestedOneWithoutAppointmentsInput
    payment?: PaymentCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    serviceId: string
    staffId: string
    payment?: PaymentUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAppointmentsNestedInput
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    service?: ServiceUpdateOneRequiredWithoutAppointmentsNestedInput
    staff?: StaffUpdateOneRequiredWithoutAppointmentsNestedInput
    payment?: PaymentUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    payment?: PaymentUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentCreateManyInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    serviceId: string
    staffId: string
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentId: string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt?: Date | string
    updatedAt?: Date | string
    appointmentId: string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointmentId?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    staff: StaffCreateNestedOneWithoutSchedulesInput
  }

  export type ScheduleUncheckedCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    staffId: string
  }

  export type ScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    staff?: StaffUpdateOneRequiredWithoutSchedulesNestedInput
  }

  export type ScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleCreateManyInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    staffId: string
  }

  export type ScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type BusinessHoursCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
    business: BusinessCreateNestedOneWithoutBusinessHoursInput
  }

  export type BusinessHoursUncheckedCreateInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
    businessId: string
  }

  export type BusinessHoursUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    business?: BusinessUpdateOneRequiredWithoutBusinessHoursNestedInput
  }

  export type BusinessHoursUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type BusinessHoursCreateManyInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
    businessId: string
  }

  export type BusinessHoursUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BusinessHoursUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type ClientRelationshipCreateInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutClientRelationshipsInput
    client: ClientCreateNestedOneWithoutRelationshipInput
    noteHistory?: RelationshipNoteCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUncheckedCreateInput = {
    id?: string
    clientId: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    noteHistory?: RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput
    client?: ClientUpdateOneRequiredWithoutRelationshipNestedInput
    noteHistory?: RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    noteHistory?: RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipCreateManyInput = {
    id?: string
    clientId: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientRelationshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientRelationshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryCreateInput = {
    id?: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    clientRelationship: ClientRelationshipCreateNestedOneWithoutVisitHistoryInput
  }

  export type VisitHistoryUncheckedCreateInput = {
    id?: string
    relationshipId: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientRelationship?: ClientRelationshipUpdateOneRequiredWithoutVisitHistoryNestedInput
  }

  export type VisitHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryCreateManyInput = {
    id?: string
    relationshipId: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationshipNoteCreateInput = {
    id?: string
    noteType: $Enums.NoteType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: StaffCreateNestedOneWithoutRelationshipNotesInput
    clientRelationship: ClientRelationshipCreateNestedOneWithoutNoteHistoryInput
  }

  export type RelationshipNoteUncheckedCreateInput = {
    id?: string
    relationshipId: string
    noteType: $Enums.NoteType
    content: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RelationshipNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StaffUpdateOneRequiredWithoutRelationshipNotesNestedInput
    clientRelationship?: ClientRelationshipUpdateOneRequiredWithoutNoteHistoryNestedInput
  }

  export type RelationshipNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationshipNoteCreateManyInput = {
    id?: string
    relationshipId: string
    noteType: $Enums.NoteType
    content: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RelationshipNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationshipNoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumBusinessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BusinessType | EnumBusinessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBusinessTypeFilter<$PrismaModel> | $Enums.BusinessType
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
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type BusinessHoursListRelationFilter = {
    every?: BusinessHoursWhereInput
    some?: BusinessHoursWhereInput
    none?: BusinessHoursWhereInput
  }

  export type ClientRelationshipListRelationFilter = {
    every?: ClientRelationshipWhereInput
    some?: ClientRelationshipWhereInput
    none?: ClientRelationshipWhereInput
  }

  export type ClientListRelationFilter = {
    every?: ClientWhereInput
    some?: ClientWhereInput
    none?: ClientWhereInput
  }

  export type ServiceCategoryListRelationFilter = {
    every?: ServiceCategoryWhereInput
    some?: ServiceCategoryWhereInput
    none?: ServiceCategoryWhereInput
  }

  export type ServiceListRelationFilter = {
    every?: ServiceWhereInput
    some?: ServiceWhereInput
    none?: ServiceWhereInput
  }

  export type StaffListRelationFilter = {
    every?: StaffWhereInput
    some?: StaffWhereInput
    none?: StaffWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BusinessHoursOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientRelationshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ServiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StaffOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BusinessCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    settings?: SortOrder
  }

  export type BusinessMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
  }

  export type BusinessMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    email?: SortOrder
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

  export type EnumBusinessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BusinessType | EnumBusinessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBusinessTypeWithAggregatesFilter<$PrismaModel> | $Enums.BusinessType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBusinessTypeFilter<$PrismaModel>
    _max?: NestedEnumBusinessTypeFilter<$PrismaModel>
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
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumStaffRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | EnumStaffRoleFieldRefInput<$PrismaModel>
    in?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumStaffRoleFilter<$PrismaModel> | $Enums.StaffRole
  }

  export type RelationshipNoteListRelationFilter = {
    every?: RelationshipNoteWhereInput
    some?: RelationshipNoteWhereInput
    none?: RelationshipNoteWhereInput
  }

  export type ScheduleListRelationFilter = {
    every?: ScheduleWhereInput
    some?: ScheduleWhereInput
    none?: ScheduleWhereInput
  }

  export type BusinessRelationFilter = {
    is?: BusinessWhereInput
    isNot?: BusinessWhereInput
  }

  export type RelationshipNoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StaffCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type StaffMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type StaffMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type EnumStaffRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | EnumStaffRoleFieldRefInput<$PrismaModel>
    in?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel> | $Enums.StaffRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStaffRoleFilter<$PrismaModel>
    _max?: NestedEnumStaffRoleFilter<$PrismaModel>
  }

  export type ServiceCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type ServiceCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type ServiceCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    color?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type ClientRelationshipNullableRelationFilter = {
    is?: ClientRelationshipWhereInput | null
    isNot?: ClientRelationshipWhereInput | null
  }

  export type ClientSensitiveInfoNullableRelationFilter = {
    is?: ClientSensitiveInfoWhereInput | null
    isNot?: ClientSensitiveInfoWhereInput | null
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type ClientRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type ClientSensitiveInfoCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    notes?: SortOrder
    medicalInfo?: SortOrder
    documents?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientId?: SortOrder
    encryptionStatus?: SortOrder
    lastAccessedAt?: SortOrder
    accessLog?: SortOrder
  }

  export type ClientSensitiveInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    notes?: SortOrder
    medicalInfo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientId?: SortOrder
    encryptionStatus?: SortOrder
    lastAccessedAt?: SortOrder
  }

  export type ClientSensitiveInfoMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    notes?: SortOrder
    medicalInfo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    clientId?: SortOrder
    encryptionStatus?: SortOrder
    lastAccessedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type ServiceCategoryNullableRelationFilter = {
    is?: ServiceCategoryWhereInput | null
    isNot?: ServiceCategoryWhereInput | null
  }

  export type ServiceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    categoryId?: SortOrder
  }

  export type ServiceAvgOrderByAggregateInput = {
    duration?: SortOrder
    price?: SortOrder
  }

  export type ServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    categoryId?: SortOrder
  }

  export type ServiceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    price?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    categoryId?: SortOrder
  }

  export type ServiceSumOrderByAggregateInput = {
    duration?: SortOrder
    price?: SortOrder
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

  export type EnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type ServiceRelationFilter = {
    is?: ServiceWhereInput
    isNot?: ServiceWhereInput
  }

  export type StaffRelationFilter = {
    is?: StaffWhereInput
    isNot?: StaffWhereInput
  }

  export type PaymentNullableRelationFilter = {
    is?: PaymentWhereInput | null
    isNot?: PaymentWhereInput | null
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    clientId?: SortOrder
    serviceId?: SortOrder
    staffId?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    clientId?: SortOrder
    serviceId?: SortOrder
    staffId?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    clientId?: SortOrder
    serviceId?: SortOrder
    staffId?: SortOrder
  }

  export type EnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type AppointmentRelationFilter = {
    is?: AppointmentWhereInput
    isNot?: AppointmentWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    paymentMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type ScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    staffId?: SortOrder
  }

  export type ScheduleAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type ScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    staffId?: SortOrder
  }

  export type ScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    staffId?: SortOrder
  }

  export type ScheduleSumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type BusinessHoursCountOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isClosed?: SortOrder
    businessId?: SortOrder
  }

  export type BusinessHoursAvgOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type BusinessHoursMaxOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isClosed?: SortOrder
    businessId?: SortOrder
  }

  export type BusinessHoursMinOrderByAggregateInput = {
    id?: SortOrder
    dayOfWeek?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isClosed?: SortOrder
    businessId?: SortOrder
  }

  export type BusinessHoursSumOrderByAggregateInput = {
    dayOfWeek?: SortOrder
  }

  export type EnumClientStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatus | EnumClientStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatusFilter<$PrismaModel> | $Enums.ClientStatus
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

  export type EnumClientFlagNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientFlag[] | ListEnumClientFlagFieldRefInput<$PrismaModel> | null
    has?: $Enums.ClientFlag | EnumClientFlagFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.ClientFlag[] | ListEnumClientFlagFieldRefInput<$PrismaModel>
    hasSome?: $Enums.ClientFlag[] | ListEnumClientFlagFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type VisitHistoryListRelationFilter = {
    every?: VisitHistoryWhereInput
    some?: VisitHistoryWhereInput
    none?: VisitHistoryWhereInput
  }

  export type VisitHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientRelationshipCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    relationshipStartDate?: SortOrder
    lastVisit?: SortOrder
    visitFrequency?: SortOrder
    lifetimeValue?: SortOrder
    preferences?: SortOrder
    internalNotes?: SortOrder
    flags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientRelationshipAvgOrderByAggregateInput = {
    visitFrequency?: SortOrder
    lifetimeValue?: SortOrder
  }

  export type ClientRelationshipMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    relationshipStartDate?: SortOrder
    lastVisit?: SortOrder
    visitFrequency?: SortOrder
    lifetimeValue?: SortOrder
    internalNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientRelationshipMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    businessId?: SortOrder
    status?: SortOrder
    relationshipStartDate?: SortOrder
    lastVisit?: SortOrder
    visitFrequency?: SortOrder
    lifetimeValue?: SortOrder
    internalNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientRelationshipSumOrderByAggregateInput = {
    visitFrequency?: SortOrder
    lifetimeValue?: SortOrder
  }

  export type EnumClientStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatus | EnumClientStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClientStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientStatusFilter<$PrismaModel>
    _max?: NestedEnumClientStatusFilter<$PrismaModel>
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

  export type ClientRelationshipRelationFilter = {
    is?: ClientRelationshipWhereInput
    isNot?: ClientRelationshipWhereInput
  }

  export type VisitHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    visitDate?: SortOrder
    serviceType?: SortOrder
    staffNotes?: SortOrder
    clientFeedback?: SortOrder
    followUpRequired?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisitHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    visitDate?: SortOrder
    serviceType?: SortOrder
    staffNotes?: SortOrder
    clientFeedback?: SortOrder
    followUpRequired?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VisitHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    visitDate?: SortOrder
    serviceType?: SortOrder
    staffNotes?: SortOrder
    clientFeedback?: SortOrder
    followUpRequired?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNoteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
  }

  export type RelationshipNoteCountOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RelationshipNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RelationshipNoteMinOrderByAggregateInput = {
    id?: SortOrder
    relationshipId?: SortOrder
    noteType?: SortOrder
    content?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNoteTypeFilter<$PrismaModel>
    _max?: NestedEnumNoteTypeFilter<$PrismaModel>
  }

  export type AppointmentCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput> | AppointmentCreateWithoutBusinessInput[] | AppointmentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutBusinessInput | AppointmentCreateOrConnectWithoutBusinessInput[]
    createMany?: AppointmentCreateManyBusinessInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type BusinessHoursCreateNestedManyWithoutBusinessInput = {
    create?: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput> | BusinessHoursCreateWithoutBusinessInput[] | BusinessHoursUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BusinessHoursCreateOrConnectWithoutBusinessInput | BusinessHoursCreateOrConnectWithoutBusinessInput[]
    createMany?: BusinessHoursCreateManyBusinessInputEnvelope
    connect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
  }

  export type ClientRelationshipCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput> | ClientRelationshipCreateWithoutBusinessInput[] | ClientRelationshipUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutBusinessInput | ClientRelationshipCreateOrConnectWithoutBusinessInput[]
    createMany?: ClientRelationshipCreateManyBusinessInputEnvelope
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
  }

  export type ClientCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput> | ClientCreateWithoutBusinessInput[] | ClientUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutBusinessInput | ClientCreateOrConnectWithoutBusinessInput[]
    createMany?: ClientCreateManyBusinessInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ServiceCategoryCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput> | ServiceCategoryCreateWithoutBusinessInput[] | ServiceCategoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutBusinessInput | ServiceCategoryCreateOrConnectWithoutBusinessInput[]
    createMany?: ServiceCategoryCreateManyBusinessInputEnvelope
    connect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
  }

  export type ServiceCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput> | ServiceCreateWithoutBusinessInput[] | ServiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutBusinessInput | ServiceCreateOrConnectWithoutBusinessInput[]
    createMany?: ServiceCreateManyBusinessInputEnvelope
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type StaffCreateNestedManyWithoutBusinessInput = {
    create?: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput> | StaffCreateWithoutBusinessInput[] | StaffUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutBusinessInput | StaffCreateOrConnectWithoutBusinessInput[]
    createMany?: StaffCreateManyBusinessInputEnvelope
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput> | AppointmentCreateWithoutBusinessInput[] | AppointmentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutBusinessInput | AppointmentCreateOrConnectWithoutBusinessInput[]
    createMany?: AppointmentCreateManyBusinessInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput> | BusinessHoursCreateWithoutBusinessInput[] | BusinessHoursUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BusinessHoursCreateOrConnectWithoutBusinessInput | BusinessHoursCreateOrConnectWithoutBusinessInput[]
    createMany?: BusinessHoursCreateManyBusinessInputEnvelope
    connect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
  }

  export type ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput> | ClientRelationshipCreateWithoutBusinessInput[] | ClientRelationshipUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutBusinessInput | ClientRelationshipCreateOrConnectWithoutBusinessInput[]
    createMany?: ClientRelationshipCreateManyBusinessInputEnvelope
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput> | ClientCreateWithoutBusinessInput[] | ClientUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutBusinessInput | ClientCreateOrConnectWithoutBusinessInput[]
    createMany?: ClientCreateManyBusinessInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput> | ServiceCategoryCreateWithoutBusinessInput[] | ServiceCategoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutBusinessInput | ServiceCategoryCreateOrConnectWithoutBusinessInput[]
    createMany?: ServiceCategoryCreateManyBusinessInputEnvelope
    connect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
  }

  export type ServiceUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput> | ServiceCreateWithoutBusinessInput[] | ServiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutBusinessInput | ServiceCreateOrConnectWithoutBusinessInput[]
    createMany?: ServiceCreateManyBusinessInputEnvelope
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type StaffUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput> | StaffCreateWithoutBusinessInput[] | StaffUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutBusinessInput | StaffCreateOrConnectWithoutBusinessInput[]
    createMany?: StaffCreateManyBusinessInputEnvelope
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumBusinessTypeFieldUpdateOperationsInput = {
    set?: $Enums.BusinessType
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type AppointmentUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput> | AppointmentCreateWithoutBusinessInput[] | AppointmentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutBusinessInput | AppointmentCreateOrConnectWithoutBusinessInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutBusinessInput | AppointmentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AppointmentCreateManyBusinessInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutBusinessInput | AppointmentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutBusinessInput | AppointmentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type BusinessHoursUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput> | BusinessHoursCreateWithoutBusinessInput[] | BusinessHoursUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BusinessHoursCreateOrConnectWithoutBusinessInput | BusinessHoursCreateOrConnectWithoutBusinessInput[]
    upsert?: BusinessHoursUpsertWithWhereUniqueWithoutBusinessInput | BusinessHoursUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: BusinessHoursCreateManyBusinessInputEnvelope
    set?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    disconnect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    delete?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    connect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    update?: BusinessHoursUpdateWithWhereUniqueWithoutBusinessInput | BusinessHoursUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: BusinessHoursUpdateManyWithWhereWithoutBusinessInput | BusinessHoursUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: BusinessHoursScalarWhereInput | BusinessHoursScalarWhereInput[]
  }

  export type ClientRelationshipUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput> | ClientRelationshipCreateWithoutBusinessInput[] | ClientRelationshipUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutBusinessInput | ClientRelationshipCreateOrConnectWithoutBusinessInput[]
    upsert?: ClientRelationshipUpsertWithWhereUniqueWithoutBusinessInput | ClientRelationshipUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ClientRelationshipCreateManyBusinessInputEnvelope
    set?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    disconnect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    delete?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    update?: ClientRelationshipUpdateWithWhereUniqueWithoutBusinessInput | ClientRelationshipUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ClientRelationshipUpdateManyWithWhereWithoutBusinessInput | ClientRelationshipUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
  }

  export type ClientUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput> | ClientCreateWithoutBusinessInput[] | ClientUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutBusinessInput | ClientCreateOrConnectWithoutBusinessInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutBusinessInput | ClientUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ClientCreateManyBusinessInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutBusinessInput | ClientUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutBusinessInput | ClientUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ServiceCategoryUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput> | ServiceCategoryCreateWithoutBusinessInput[] | ServiceCategoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutBusinessInput | ServiceCategoryCreateOrConnectWithoutBusinessInput[]
    upsert?: ServiceCategoryUpsertWithWhereUniqueWithoutBusinessInput | ServiceCategoryUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ServiceCategoryCreateManyBusinessInputEnvelope
    set?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    disconnect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    delete?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    connect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    update?: ServiceCategoryUpdateWithWhereUniqueWithoutBusinessInput | ServiceCategoryUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ServiceCategoryUpdateManyWithWhereWithoutBusinessInput | ServiceCategoryUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ServiceCategoryScalarWhereInput | ServiceCategoryScalarWhereInput[]
  }

  export type ServiceUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput> | ServiceCreateWithoutBusinessInput[] | ServiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutBusinessInput | ServiceCreateOrConnectWithoutBusinessInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutBusinessInput | ServiceUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ServiceCreateManyBusinessInputEnvelope
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutBusinessInput | ServiceUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutBusinessInput | ServiceUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type StaffUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput> | StaffCreateWithoutBusinessInput[] | StaffUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutBusinessInput | StaffCreateOrConnectWithoutBusinessInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutBusinessInput | StaffUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: StaffCreateManyBusinessInputEnvelope
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutBusinessInput | StaffUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutBusinessInput | StaffUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput> | AppointmentCreateWithoutBusinessInput[] | AppointmentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutBusinessInput | AppointmentCreateOrConnectWithoutBusinessInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutBusinessInput | AppointmentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: AppointmentCreateManyBusinessInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutBusinessInput | AppointmentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutBusinessInput | AppointmentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput> | BusinessHoursCreateWithoutBusinessInput[] | BusinessHoursUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BusinessHoursCreateOrConnectWithoutBusinessInput | BusinessHoursCreateOrConnectWithoutBusinessInput[]
    upsert?: BusinessHoursUpsertWithWhereUniqueWithoutBusinessInput | BusinessHoursUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: BusinessHoursCreateManyBusinessInputEnvelope
    set?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    disconnect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    delete?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    connect?: BusinessHoursWhereUniqueInput | BusinessHoursWhereUniqueInput[]
    update?: BusinessHoursUpdateWithWhereUniqueWithoutBusinessInput | BusinessHoursUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: BusinessHoursUpdateManyWithWhereWithoutBusinessInput | BusinessHoursUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: BusinessHoursScalarWhereInput | BusinessHoursScalarWhereInput[]
  }

  export type ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput> | ClientRelationshipCreateWithoutBusinessInput[] | ClientRelationshipUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutBusinessInput | ClientRelationshipCreateOrConnectWithoutBusinessInput[]
    upsert?: ClientRelationshipUpsertWithWhereUniqueWithoutBusinessInput | ClientRelationshipUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ClientRelationshipCreateManyBusinessInputEnvelope
    set?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    disconnect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    delete?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    update?: ClientRelationshipUpdateWithWhereUniqueWithoutBusinessInput | ClientRelationshipUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ClientRelationshipUpdateManyWithWhereWithoutBusinessInput | ClientRelationshipUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
  }

  export type ClientUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput> | ClientCreateWithoutBusinessInput[] | ClientUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutBusinessInput | ClientCreateOrConnectWithoutBusinessInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutBusinessInput | ClientUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ClientCreateManyBusinessInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutBusinessInput | ClientUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutBusinessInput | ClientUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput> | ServiceCategoryCreateWithoutBusinessInput[] | ServiceCategoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutBusinessInput | ServiceCategoryCreateOrConnectWithoutBusinessInput[]
    upsert?: ServiceCategoryUpsertWithWhereUniqueWithoutBusinessInput | ServiceCategoryUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ServiceCategoryCreateManyBusinessInputEnvelope
    set?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    disconnect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    delete?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    connect?: ServiceCategoryWhereUniqueInput | ServiceCategoryWhereUniqueInput[]
    update?: ServiceCategoryUpdateWithWhereUniqueWithoutBusinessInput | ServiceCategoryUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ServiceCategoryUpdateManyWithWhereWithoutBusinessInput | ServiceCategoryUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ServiceCategoryScalarWhereInput | ServiceCategoryScalarWhereInput[]
  }

  export type ServiceUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput> | ServiceCreateWithoutBusinessInput[] | ServiceUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutBusinessInput | ServiceCreateOrConnectWithoutBusinessInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutBusinessInput | ServiceUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: ServiceCreateManyBusinessInputEnvelope
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutBusinessInput | ServiceUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutBusinessInput | ServiceUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type StaffUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput> | StaffCreateWithoutBusinessInput[] | StaffUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutBusinessInput | StaffCreateOrConnectWithoutBusinessInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutBusinessInput | StaffUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: StaffCreateManyBusinessInputEnvelope
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutBusinessInput | StaffUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutBusinessInput | StaffUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type AppointmentCreateNestedManyWithoutStaffInput = {
    create?: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput> | AppointmentCreateWithoutStaffInput[] | AppointmentUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutStaffInput | AppointmentCreateOrConnectWithoutStaffInput[]
    createMany?: AppointmentCreateManyStaffInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type RelationshipNoteCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput> | RelationshipNoteCreateWithoutCreatedByInput[] | RelationshipNoteUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutCreatedByInput | RelationshipNoteCreateOrConnectWithoutCreatedByInput[]
    createMany?: RelationshipNoteCreateManyCreatedByInputEnvelope
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
  }

  export type ScheduleCreateNestedManyWithoutStaffInput = {
    create?: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput> | ScheduleCreateWithoutStaffInput[] | ScheduleUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutStaffInput | ScheduleCreateOrConnectWithoutStaffInput[]
    createMany?: ScheduleCreateManyStaffInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type BusinessCreateNestedOneWithoutStaffInput = {
    create?: XOR<BusinessCreateWithoutStaffInput, BusinessUncheckedCreateWithoutStaffInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutStaffInput
    connect?: BusinessWhereUniqueInput
  }

  export type ClientRelationshipCreateNestedManyWithoutPreferredStaffInput = {
    create?: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput> | ClientRelationshipCreateWithoutPreferredStaffInput[] | ClientRelationshipUncheckedCreateWithoutPreferredStaffInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutPreferredStaffInput | ClientRelationshipCreateOrConnectWithoutPreferredStaffInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
  }

  export type ServiceCreateNestedManyWithoutProvidersInput = {
    create?: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput> | ServiceCreateWithoutProvidersInput[] | ServiceUncheckedCreateWithoutProvidersInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutProvidersInput | ServiceCreateOrConnectWithoutProvidersInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutStaffInput = {
    create?: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput> | AppointmentCreateWithoutStaffInput[] | AppointmentUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutStaffInput | AppointmentCreateOrConnectWithoutStaffInput[]
    createMany?: AppointmentCreateManyStaffInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput> | RelationshipNoteCreateWithoutCreatedByInput[] | RelationshipNoteUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutCreatedByInput | RelationshipNoteCreateOrConnectWithoutCreatedByInput[]
    createMany?: RelationshipNoteCreateManyCreatedByInputEnvelope
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
  }

  export type ScheduleUncheckedCreateNestedManyWithoutStaffInput = {
    create?: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput> | ScheduleCreateWithoutStaffInput[] | ScheduleUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutStaffInput | ScheduleCreateOrConnectWithoutStaffInput[]
    createMany?: ScheduleCreateManyStaffInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput = {
    create?: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput> | ClientRelationshipCreateWithoutPreferredStaffInput[] | ClientRelationshipUncheckedCreateWithoutPreferredStaffInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutPreferredStaffInput | ClientRelationshipCreateOrConnectWithoutPreferredStaffInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
  }

  export type ServiceUncheckedCreateNestedManyWithoutProvidersInput = {
    create?: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput> | ServiceCreateWithoutProvidersInput[] | ServiceUncheckedCreateWithoutProvidersInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutProvidersInput | ServiceCreateOrConnectWithoutProvidersInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type EnumStaffRoleFieldUpdateOperationsInput = {
    set?: $Enums.StaffRole
  }

  export type AppointmentUpdateManyWithoutStaffNestedInput = {
    create?: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput> | AppointmentCreateWithoutStaffInput[] | AppointmentUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutStaffInput | AppointmentCreateOrConnectWithoutStaffInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutStaffInput | AppointmentUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: AppointmentCreateManyStaffInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutStaffInput | AppointmentUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutStaffInput | AppointmentUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type RelationshipNoteUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput> | RelationshipNoteCreateWithoutCreatedByInput[] | RelationshipNoteUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutCreatedByInput | RelationshipNoteCreateOrConnectWithoutCreatedByInput[]
    upsert?: RelationshipNoteUpsertWithWhereUniqueWithoutCreatedByInput | RelationshipNoteUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: RelationshipNoteCreateManyCreatedByInputEnvelope
    set?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    disconnect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    delete?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    update?: RelationshipNoteUpdateWithWhereUniqueWithoutCreatedByInput | RelationshipNoteUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: RelationshipNoteUpdateManyWithWhereWithoutCreatedByInput | RelationshipNoteUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
  }

  export type ScheduleUpdateManyWithoutStaffNestedInput = {
    create?: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput> | ScheduleCreateWithoutStaffInput[] | ScheduleUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutStaffInput | ScheduleCreateOrConnectWithoutStaffInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutStaffInput | ScheduleUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: ScheduleCreateManyStaffInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutStaffInput | ScheduleUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutStaffInput | ScheduleUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type BusinessUpdateOneRequiredWithoutStaffNestedInput = {
    create?: XOR<BusinessCreateWithoutStaffInput, BusinessUncheckedCreateWithoutStaffInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutStaffInput
    upsert?: BusinessUpsertWithoutStaffInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutStaffInput, BusinessUpdateWithoutStaffInput>, BusinessUncheckedUpdateWithoutStaffInput>
  }

  export type ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput> | ClientRelationshipCreateWithoutPreferredStaffInput[] | ClientRelationshipUncheckedCreateWithoutPreferredStaffInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutPreferredStaffInput | ClientRelationshipCreateOrConnectWithoutPreferredStaffInput[]
    upsert?: ClientRelationshipUpsertWithWhereUniqueWithoutPreferredStaffInput | ClientRelationshipUpsertWithWhereUniqueWithoutPreferredStaffInput[]
    set?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    disconnect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    delete?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    update?: ClientRelationshipUpdateWithWhereUniqueWithoutPreferredStaffInput | ClientRelationshipUpdateWithWhereUniqueWithoutPreferredStaffInput[]
    updateMany?: ClientRelationshipUpdateManyWithWhereWithoutPreferredStaffInput | ClientRelationshipUpdateManyWithWhereWithoutPreferredStaffInput[]
    deleteMany?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
  }

  export type ServiceUpdateManyWithoutProvidersNestedInput = {
    create?: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput> | ServiceCreateWithoutProvidersInput[] | ServiceUncheckedCreateWithoutProvidersInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutProvidersInput | ServiceCreateOrConnectWithoutProvidersInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutProvidersInput | ServiceUpsertWithWhereUniqueWithoutProvidersInput[]
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutProvidersInput | ServiceUpdateWithWhereUniqueWithoutProvidersInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutProvidersInput | ServiceUpdateManyWithWhereWithoutProvidersInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutStaffNestedInput = {
    create?: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput> | AppointmentCreateWithoutStaffInput[] | AppointmentUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutStaffInput | AppointmentCreateOrConnectWithoutStaffInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutStaffInput | AppointmentUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: AppointmentCreateManyStaffInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutStaffInput | AppointmentUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutStaffInput | AppointmentUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput> | RelationshipNoteCreateWithoutCreatedByInput[] | RelationshipNoteUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutCreatedByInput | RelationshipNoteCreateOrConnectWithoutCreatedByInput[]
    upsert?: RelationshipNoteUpsertWithWhereUniqueWithoutCreatedByInput | RelationshipNoteUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: RelationshipNoteCreateManyCreatedByInputEnvelope
    set?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    disconnect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    delete?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    update?: RelationshipNoteUpdateWithWhereUniqueWithoutCreatedByInput | RelationshipNoteUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: RelationshipNoteUpdateManyWithWhereWithoutCreatedByInput | RelationshipNoteUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
  }

  export type ScheduleUncheckedUpdateManyWithoutStaffNestedInput = {
    create?: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput> | ScheduleCreateWithoutStaffInput[] | ScheduleUncheckedCreateWithoutStaffInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutStaffInput | ScheduleCreateOrConnectWithoutStaffInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutStaffInput | ScheduleUpsertWithWhereUniqueWithoutStaffInput[]
    createMany?: ScheduleCreateManyStaffInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutStaffInput | ScheduleUpdateWithWhereUniqueWithoutStaffInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutStaffInput | ScheduleUpdateManyWithWhereWithoutStaffInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput> | ClientRelationshipCreateWithoutPreferredStaffInput[] | ClientRelationshipUncheckedCreateWithoutPreferredStaffInput[]
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutPreferredStaffInput | ClientRelationshipCreateOrConnectWithoutPreferredStaffInput[]
    upsert?: ClientRelationshipUpsertWithWhereUniqueWithoutPreferredStaffInput | ClientRelationshipUpsertWithWhereUniqueWithoutPreferredStaffInput[]
    set?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    disconnect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    delete?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    connect?: ClientRelationshipWhereUniqueInput | ClientRelationshipWhereUniqueInput[]
    update?: ClientRelationshipUpdateWithWhereUniqueWithoutPreferredStaffInput | ClientRelationshipUpdateWithWhereUniqueWithoutPreferredStaffInput[]
    updateMany?: ClientRelationshipUpdateManyWithWhereWithoutPreferredStaffInput | ClientRelationshipUpdateManyWithWhereWithoutPreferredStaffInput[]
    deleteMany?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
  }

  export type ServiceUncheckedUpdateManyWithoutProvidersNestedInput = {
    create?: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput> | ServiceCreateWithoutProvidersInput[] | ServiceUncheckedCreateWithoutProvidersInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutProvidersInput | ServiceCreateOrConnectWithoutProvidersInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutProvidersInput | ServiceUpsertWithWhereUniqueWithoutProvidersInput[]
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutProvidersInput | ServiceUpdateWithWhereUniqueWithoutProvidersInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutProvidersInput | ServiceUpdateManyWithWhereWithoutProvidersInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<BusinessCreateWithoutCategoriesInput, BusinessUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCategoriesInput
    connect?: BusinessWhereUniqueInput
  }

  export type ServiceCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput> | ServiceCreateWithoutCategoryInput[] | ServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutCategoryInput | ServiceCreateOrConnectWithoutCategoryInput[]
    createMany?: ServiceCreateManyCategoryInputEnvelope
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type ServiceUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput> | ServiceCreateWithoutCategoryInput[] | ServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutCategoryInput | ServiceCreateOrConnectWithoutCategoryInput[]
    createMany?: ServiceCreateManyCategoryInputEnvelope
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
  }

  export type BusinessUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<BusinessCreateWithoutCategoriesInput, BusinessUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCategoriesInput
    upsert?: BusinessUpsertWithoutCategoriesInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutCategoriesInput, BusinessUpdateWithoutCategoriesInput>, BusinessUncheckedUpdateWithoutCategoriesInput>
  }

  export type ServiceUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput> | ServiceCreateWithoutCategoryInput[] | ServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutCategoryInput | ServiceCreateOrConnectWithoutCategoryInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutCategoryInput | ServiceUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ServiceCreateManyCategoryInputEnvelope
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutCategoryInput | ServiceUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutCategoryInput | ServiceUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type ServiceUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput> | ServiceCreateWithoutCategoryInput[] | ServiceUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: ServiceCreateOrConnectWithoutCategoryInput | ServiceCreateOrConnectWithoutCategoryInput[]
    upsert?: ServiceUpsertWithWhereUniqueWithoutCategoryInput | ServiceUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: ServiceCreateManyCategoryInputEnvelope
    set?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    disconnect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    delete?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    connect?: ServiceWhereUniqueInput | ServiceWhereUniqueInput[]
    update?: ServiceUpdateWithWhereUniqueWithoutCategoryInput | ServiceUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: ServiceUpdateManyWithWhereWithoutCategoryInput | ServiceUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
  }

  export type AppointmentCreateNestedManyWithoutClientInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type ClientRelationshipCreateNestedOneWithoutClientInput = {
    create?: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutClientInput
    connect?: ClientRelationshipWhereUniqueInput
  }

  export type ClientSensitiveInfoCreateNestedOneWithoutClientInput = {
    create?: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientSensitiveInfoCreateOrConnectWithoutClientInput
    connect?: ClientSensitiveInfoWhereUniqueInput
  }

  export type BusinessCreateNestedOneWithoutClientsInput = {
    create?: XOR<BusinessCreateWithoutClientsInput, BusinessUncheckedCreateWithoutClientsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutClientsInput
    connect?: BusinessWhereUniqueInput
  }

  export type AppointmentUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type ClientRelationshipUncheckedCreateNestedOneWithoutClientInput = {
    create?: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutClientInput
    connect?: ClientRelationshipWhereUniqueInput
  }

  export type ClientSensitiveInfoUncheckedCreateNestedOneWithoutClientInput = {
    create?: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientSensitiveInfoCreateOrConnectWithoutClientInput
    connect?: ClientSensitiveInfoWhereUniqueInput
  }

  export type AppointmentUpdateManyWithoutClientNestedInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutClientInput | AppointmentUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutClientInput | AppointmentUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutClientInput | AppointmentUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type ClientRelationshipUpdateOneWithoutClientNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutClientInput
    upsert?: ClientRelationshipUpsertWithoutClientInput
    disconnect?: ClientRelationshipWhereInput | boolean
    delete?: ClientRelationshipWhereInput | boolean
    connect?: ClientRelationshipWhereUniqueInput
    update?: XOR<XOR<ClientRelationshipUpdateToOneWithWhereWithoutClientInput, ClientRelationshipUpdateWithoutClientInput>, ClientRelationshipUncheckedUpdateWithoutClientInput>
  }

  export type ClientSensitiveInfoUpdateOneWithoutClientNestedInput = {
    create?: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientSensitiveInfoCreateOrConnectWithoutClientInput
    upsert?: ClientSensitiveInfoUpsertWithoutClientInput
    disconnect?: ClientSensitiveInfoWhereInput | boolean
    delete?: ClientSensitiveInfoWhereInput | boolean
    connect?: ClientSensitiveInfoWhereUniqueInput
    update?: XOR<XOR<ClientSensitiveInfoUpdateToOneWithWhereWithoutClientInput, ClientSensitiveInfoUpdateWithoutClientInput>, ClientSensitiveInfoUncheckedUpdateWithoutClientInput>
  }

  export type BusinessUpdateOneRequiredWithoutClientsNestedInput = {
    create?: XOR<BusinessCreateWithoutClientsInput, BusinessUncheckedCreateWithoutClientsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutClientsInput
    upsert?: BusinessUpsertWithoutClientsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutClientsInput, BusinessUpdateWithoutClientsInput>, BusinessUncheckedUpdateWithoutClientsInput>
  }

  export type AppointmentUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput> | AppointmentCreateWithoutClientInput[] | AppointmentUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutClientInput | AppointmentCreateOrConnectWithoutClientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutClientInput | AppointmentUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AppointmentCreateManyClientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutClientInput | AppointmentUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutClientInput | AppointmentUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type ClientRelationshipUncheckedUpdateOneWithoutClientNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutClientInput
    upsert?: ClientRelationshipUpsertWithoutClientInput
    disconnect?: ClientRelationshipWhereInput | boolean
    delete?: ClientRelationshipWhereInput | boolean
    connect?: ClientRelationshipWhereUniqueInput
    update?: XOR<XOR<ClientRelationshipUpdateToOneWithWhereWithoutClientInput, ClientRelationshipUpdateWithoutClientInput>, ClientRelationshipUncheckedUpdateWithoutClientInput>
  }

  export type ClientSensitiveInfoUncheckedUpdateOneWithoutClientNestedInput = {
    create?: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
    connectOrCreate?: ClientSensitiveInfoCreateOrConnectWithoutClientInput
    upsert?: ClientSensitiveInfoUpsertWithoutClientInput
    disconnect?: ClientSensitiveInfoWhereInput | boolean
    delete?: ClientSensitiveInfoWhereInput | boolean
    connect?: ClientSensitiveInfoWhereUniqueInput
    update?: XOR<XOR<ClientSensitiveInfoUpdateToOneWithWhereWithoutClientInput, ClientSensitiveInfoUpdateWithoutClientInput>, ClientSensitiveInfoUncheckedUpdateWithoutClientInput>
  }

  export type ClientCreateNestedOneWithoutSensitiveInfoInput = {
    create?: XOR<ClientCreateWithoutSensitiveInfoInput, ClientUncheckedCreateWithoutSensitiveInfoInput>
    connectOrCreate?: ClientCreateOrConnectWithoutSensitiveInfoInput
    connect?: ClientWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ClientUpdateOneRequiredWithoutSensitiveInfoNestedInput = {
    create?: XOR<ClientCreateWithoutSensitiveInfoInput, ClientUncheckedCreateWithoutSensitiveInfoInput>
    connectOrCreate?: ClientCreateOrConnectWithoutSensitiveInfoInput
    upsert?: ClientUpsertWithoutSensitiveInfoInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutSensitiveInfoInput, ClientUpdateWithoutSensitiveInfoInput>, ClientUncheckedUpdateWithoutSensitiveInfoInput>
  }

  export type AppointmentCreateNestedManyWithoutServiceInput = {
    create?: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput> | AppointmentCreateWithoutServiceInput[] | AppointmentUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutServiceInput | AppointmentCreateOrConnectWithoutServiceInput[]
    createMany?: AppointmentCreateManyServiceInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type BusinessCreateNestedOneWithoutServicesInput = {
    create?: XOR<BusinessCreateWithoutServicesInput, BusinessUncheckedCreateWithoutServicesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutServicesInput
    connect?: BusinessWhereUniqueInput
  }

  export type ServiceCategoryCreateNestedOneWithoutServicesInput = {
    create?: XOR<ServiceCategoryCreateWithoutServicesInput, ServiceCategoryUncheckedCreateWithoutServicesInput>
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutServicesInput
    connect?: ServiceCategoryWhereUniqueInput
  }

  export type StaffCreateNestedManyWithoutServicesInput = {
    create?: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput> | StaffCreateWithoutServicesInput[] | StaffUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutServicesInput | StaffCreateOrConnectWithoutServicesInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutServiceInput = {
    create?: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput> | AppointmentCreateWithoutServiceInput[] | AppointmentUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutServiceInput | AppointmentCreateOrConnectWithoutServiceInput[]
    createMany?: AppointmentCreateManyServiceInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type StaffUncheckedCreateNestedManyWithoutServicesInput = {
    create?: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput> | StaffCreateWithoutServicesInput[] | StaffUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutServicesInput | StaffCreateOrConnectWithoutServicesInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type AppointmentUpdateManyWithoutServiceNestedInput = {
    create?: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput> | AppointmentCreateWithoutServiceInput[] | AppointmentUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutServiceInput | AppointmentCreateOrConnectWithoutServiceInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutServiceInput | AppointmentUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: AppointmentCreateManyServiceInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutServiceInput | AppointmentUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutServiceInput | AppointmentUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type BusinessUpdateOneRequiredWithoutServicesNestedInput = {
    create?: XOR<BusinessCreateWithoutServicesInput, BusinessUncheckedCreateWithoutServicesInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutServicesInput
    upsert?: BusinessUpsertWithoutServicesInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutServicesInput, BusinessUpdateWithoutServicesInput>, BusinessUncheckedUpdateWithoutServicesInput>
  }

  export type ServiceCategoryUpdateOneWithoutServicesNestedInput = {
    create?: XOR<ServiceCategoryCreateWithoutServicesInput, ServiceCategoryUncheckedCreateWithoutServicesInput>
    connectOrCreate?: ServiceCategoryCreateOrConnectWithoutServicesInput
    upsert?: ServiceCategoryUpsertWithoutServicesInput
    disconnect?: ServiceCategoryWhereInput | boolean
    delete?: ServiceCategoryWhereInput | boolean
    connect?: ServiceCategoryWhereUniqueInput
    update?: XOR<XOR<ServiceCategoryUpdateToOneWithWhereWithoutServicesInput, ServiceCategoryUpdateWithoutServicesInput>, ServiceCategoryUncheckedUpdateWithoutServicesInput>
  }

  export type StaffUpdateManyWithoutServicesNestedInput = {
    create?: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput> | StaffCreateWithoutServicesInput[] | StaffUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutServicesInput | StaffCreateOrConnectWithoutServicesInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutServicesInput | StaffUpsertWithWhereUniqueWithoutServicesInput[]
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutServicesInput | StaffUpdateWithWhereUniqueWithoutServicesInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutServicesInput | StaffUpdateManyWithWhereWithoutServicesInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutServiceNestedInput = {
    create?: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput> | AppointmentCreateWithoutServiceInput[] | AppointmentUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutServiceInput | AppointmentCreateOrConnectWithoutServiceInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutServiceInput | AppointmentUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: AppointmentCreateManyServiceInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutServiceInput | AppointmentUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutServiceInput | AppointmentUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type StaffUncheckedUpdateManyWithoutServicesNestedInput = {
    create?: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput> | StaffCreateWithoutServicesInput[] | StaffUncheckedCreateWithoutServicesInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutServicesInput | StaffCreateOrConnectWithoutServicesInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutServicesInput | StaffUpsertWithWhereUniqueWithoutServicesInput[]
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutServicesInput | StaffUpdateWithWhereUniqueWithoutServicesInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutServicesInput | StaffUpdateManyWithWhereWithoutServicesInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<BusinessCreateWithoutAppointmentsInput, BusinessUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAppointmentsInput
    connect?: BusinessWhereUniqueInput
  }

  export type ClientCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAppointmentsInput
    connect?: ClientWhereUniqueInput
  }

  export type ServiceCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<ServiceCreateWithoutAppointmentsInput, ServiceUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutAppointmentsInput
    connect?: ServiceWhereUniqueInput
  }

  export type StaffCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<StaffCreateWithoutAppointmentsInput, StaffUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: StaffCreateOrConnectWithoutAppointmentsInput
    connect?: StaffWhereUniqueInput
  }

  export type PaymentCreateNestedOneWithoutAppointmentInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput
    connect?: PaymentWhereUniqueInput
  }

  export type PaymentUncheckedCreateNestedOneWithoutAppointmentInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput
    connect?: PaymentWhereUniqueInput
  }

  export type EnumAppointmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AppointmentStatus
  }

  export type BusinessUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<BusinessCreateWithoutAppointmentsInput, BusinessUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutAppointmentsInput
    upsert?: BusinessUpsertWithoutAppointmentsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutAppointmentsInput, BusinessUpdateWithoutAppointmentsInput>, BusinessUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ClientUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAppointmentsInput
    upsert?: ClientUpsertWithoutAppointmentsInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutAppointmentsInput, ClientUpdateWithoutAppointmentsInput>, ClientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ServiceUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<ServiceCreateWithoutAppointmentsInput, ServiceUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutAppointmentsInput
    upsert?: ServiceUpsertWithoutAppointmentsInput
    connect?: ServiceWhereUniqueInput
    update?: XOR<XOR<ServiceUpdateToOneWithWhereWithoutAppointmentsInput, ServiceUpdateWithoutAppointmentsInput>, ServiceUncheckedUpdateWithoutAppointmentsInput>
  }

  export type StaffUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<StaffCreateWithoutAppointmentsInput, StaffUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: StaffCreateOrConnectWithoutAppointmentsInput
    upsert?: StaffUpsertWithoutAppointmentsInput
    connect?: StaffWhereUniqueInput
    update?: XOR<XOR<StaffUpdateToOneWithWhereWithoutAppointmentsInput, StaffUpdateWithoutAppointmentsInput>, StaffUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PaymentUpdateOneWithoutAppointmentNestedInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput
    upsert?: PaymentUpsertWithoutAppointmentInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutAppointmentInput, PaymentUpdateWithoutAppointmentInput>, PaymentUncheckedUpdateWithoutAppointmentInput>
  }

  export type PaymentUncheckedUpdateOneWithoutAppointmentNestedInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput
    upsert?: PaymentUpsertWithoutAppointmentInput
    disconnect?: PaymentWhereInput | boolean
    delete?: PaymentWhereInput | boolean
    connect?: PaymentWhereUniqueInput
    update?: XOR<XOR<PaymentUpdateToOneWithWhereWithoutAppointmentInput, PaymentUpdateWithoutAppointmentInput>, PaymentUncheckedUpdateWithoutAppointmentInput>
  }

  export type AppointmentCreateNestedOneWithoutPaymentInput = {
    create?: XOR<AppointmentCreateWithoutPaymentInput, AppointmentUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutPaymentInput
    connect?: AppointmentWhereUniqueInput
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type AppointmentUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: XOR<AppointmentCreateWithoutPaymentInput, AppointmentUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutPaymentInput
    upsert?: AppointmentUpsertWithoutPaymentInput
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutPaymentInput, AppointmentUpdateWithoutPaymentInput>, AppointmentUncheckedUpdateWithoutPaymentInput>
  }

  export type StaffCreateNestedOneWithoutSchedulesInput = {
    create?: XOR<StaffCreateWithoutSchedulesInput, StaffUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: StaffCreateOrConnectWithoutSchedulesInput
    connect?: StaffWhereUniqueInput
  }

  export type StaffUpdateOneRequiredWithoutSchedulesNestedInput = {
    create?: XOR<StaffCreateWithoutSchedulesInput, StaffUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: StaffCreateOrConnectWithoutSchedulesInput
    upsert?: StaffUpsertWithoutSchedulesInput
    connect?: StaffWhereUniqueInput
    update?: XOR<XOR<StaffUpdateToOneWithWhereWithoutSchedulesInput, StaffUpdateWithoutSchedulesInput>, StaffUncheckedUpdateWithoutSchedulesInput>
  }

  export type BusinessCreateNestedOneWithoutBusinessHoursInput = {
    create?: XOR<BusinessCreateWithoutBusinessHoursInput, BusinessUncheckedCreateWithoutBusinessHoursInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutBusinessHoursInput
    connect?: BusinessWhereUniqueInput
  }

  export type BusinessUpdateOneRequiredWithoutBusinessHoursNestedInput = {
    create?: XOR<BusinessCreateWithoutBusinessHoursInput, BusinessUncheckedCreateWithoutBusinessHoursInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutBusinessHoursInput
    upsert?: BusinessUpsertWithoutBusinessHoursInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutBusinessHoursInput, BusinessUpdateWithoutBusinessHoursInput>, BusinessUncheckedUpdateWithoutBusinessHoursInput>
  }

  export type ClientRelationshipCreateflagsInput = {
    set: $Enums.ClientFlag[]
  }

  export type BusinessCreateNestedOneWithoutClientRelationshipsInput = {
    create?: XOR<BusinessCreateWithoutClientRelationshipsInput, BusinessUncheckedCreateWithoutClientRelationshipsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutClientRelationshipsInput
    connect?: BusinessWhereUniqueInput
  }

  export type ClientCreateNestedOneWithoutRelationshipInput = {
    create?: XOR<ClientCreateWithoutRelationshipInput, ClientUncheckedCreateWithoutRelationshipInput>
    connectOrCreate?: ClientCreateOrConnectWithoutRelationshipInput
    connect?: ClientWhereUniqueInput
  }

  export type RelationshipNoteCreateNestedManyWithoutClientRelationshipInput = {
    create?: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput> | RelationshipNoteCreateWithoutClientRelationshipInput[] | RelationshipNoteUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutClientRelationshipInput | RelationshipNoteCreateOrConnectWithoutClientRelationshipInput[]
    createMany?: RelationshipNoteCreateManyClientRelationshipInputEnvelope
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
  }

  export type VisitHistoryCreateNestedManyWithoutClientRelationshipInput = {
    create?: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput> | VisitHistoryCreateWithoutClientRelationshipInput[] | VisitHistoryUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: VisitHistoryCreateOrConnectWithoutClientRelationshipInput | VisitHistoryCreateOrConnectWithoutClientRelationshipInput[]
    createMany?: VisitHistoryCreateManyClientRelationshipInputEnvelope
    connect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
  }

  export type StaffCreateNestedManyWithoutPreferredByClientsInput = {
    create?: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput> | StaffCreateWithoutPreferredByClientsInput[] | StaffUncheckedCreateWithoutPreferredByClientsInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutPreferredByClientsInput | StaffCreateOrConnectWithoutPreferredByClientsInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput = {
    create?: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput> | RelationshipNoteCreateWithoutClientRelationshipInput[] | RelationshipNoteUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutClientRelationshipInput | RelationshipNoteCreateOrConnectWithoutClientRelationshipInput[]
    createMany?: RelationshipNoteCreateManyClientRelationshipInputEnvelope
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
  }

  export type VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput = {
    create?: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput> | VisitHistoryCreateWithoutClientRelationshipInput[] | VisitHistoryUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: VisitHistoryCreateOrConnectWithoutClientRelationshipInput | VisitHistoryCreateOrConnectWithoutClientRelationshipInput[]
    createMany?: VisitHistoryCreateManyClientRelationshipInputEnvelope
    connect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
  }

  export type StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput = {
    create?: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput> | StaffCreateWithoutPreferredByClientsInput[] | StaffUncheckedCreateWithoutPreferredByClientsInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutPreferredByClientsInput | StaffCreateOrConnectWithoutPreferredByClientsInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
  }

  export type EnumClientStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClientStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type ClientRelationshipUpdateflagsInput = {
    set?: $Enums.ClientFlag[]
    push?: $Enums.ClientFlag | $Enums.ClientFlag[]
  }

  export type BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput = {
    create?: XOR<BusinessCreateWithoutClientRelationshipsInput, BusinessUncheckedCreateWithoutClientRelationshipsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutClientRelationshipsInput
    upsert?: BusinessUpsertWithoutClientRelationshipsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutClientRelationshipsInput, BusinessUpdateWithoutClientRelationshipsInput>, BusinessUncheckedUpdateWithoutClientRelationshipsInput>
  }

  export type ClientUpdateOneRequiredWithoutRelationshipNestedInput = {
    create?: XOR<ClientCreateWithoutRelationshipInput, ClientUncheckedCreateWithoutRelationshipInput>
    connectOrCreate?: ClientCreateOrConnectWithoutRelationshipInput
    upsert?: ClientUpsertWithoutRelationshipInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutRelationshipInput, ClientUpdateWithoutRelationshipInput>, ClientUncheckedUpdateWithoutRelationshipInput>
  }

  export type RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput = {
    create?: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput> | RelationshipNoteCreateWithoutClientRelationshipInput[] | RelationshipNoteUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutClientRelationshipInput | RelationshipNoteCreateOrConnectWithoutClientRelationshipInput[]
    upsert?: RelationshipNoteUpsertWithWhereUniqueWithoutClientRelationshipInput | RelationshipNoteUpsertWithWhereUniqueWithoutClientRelationshipInput[]
    createMany?: RelationshipNoteCreateManyClientRelationshipInputEnvelope
    set?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    disconnect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    delete?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    update?: RelationshipNoteUpdateWithWhereUniqueWithoutClientRelationshipInput | RelationshipNoteUpdateWithWhereUniqueWithoutClientRelationshipInput[]
    updateMany?: RelationshipNoteUpdateManyWithWhereWithoutClientRelationshipInput | RelationshipNoteUpdateManyWithWhereWithoutClientRelationshipInput[]
    deleteMany?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
  }

  export type VisitHistoryUpdateManyWithoutClientRelationshipNestedInput = {
    create?: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput> | VisitHistoryCreateWithoutClientRelationshipInput[] | VisitHistoryUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: VisitHistoryCreateOrConnectWithoutClientRelationshipInput | VisitHistoryCreateOrConnectWithoutClientRelationshipInput[]
    upsert?: VisitHistoryUpsertWithWhereUniqueWithoutClientRelationshipInput | VisitHistoryUpsertWithWhereUniqueWithoutClientRelationshipInput[]
    createMany?: VisitHistoryCreateManyClientRelationshipInputEnvelope
    set?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    disconnect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    delete?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    connect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    update?: VisitHistoryUpdateWithWhereUniqueWithoutClientRelationshipInput | VisitHistoryUpdateWithWhereUniqueWithoutClientRelationshipInput[]
    updateMany?: VisitHistoryUpdateManyWithWhereWithoutClientRelationshipInput | VisitHistoryUpdateManyWithWhereWithoutClientRelationshipInput[]
    deleteMany?: VisitHistoryScalarWhereInput | VisitHistoryScalarWhereInput[]
  }

  export type StaffUpdateManyWithoutPreferredByClientsNestedInput = {
    create?: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput> | StaffCreateWithoutPreferredByClientsInput[] | StaffUncheckedCreateWithoutPreferredByClientsInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutPreferredByClientsInput | StaffCreateOrConnectWithoutPreferredByClientsInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutPreferredByClientsInput | StaffUpsertWithWhereUniqueWithoutPreferredByClientsInput[]
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutPreferredByClientsInput | StaffUpdateWithWhereUniqueWithoutPreferredByClientsInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutPreferredByClientsInput | StaffUpdateManyWithWhereWithoutPreferredByClientsInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput = {
    create?: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput> | RelationshipNoteCreateWithoutClientRelationshipInput[] | RelationshipNoteUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: RelationshipNoteCreateOrConnectWithoutClientRelationshipInput | RelationshipNoteCreateOrConnectWithoutClientRelationshipInput[]
    upsert?: RelationshipNoteUpsertWithWhereUniqueWithoutClientRelationshipInput | RelationshipNoteUpsertWithWhereUniqueWithoutClientRelationshipInput[]
    createMany?: RelationshipNoteCreateManyClientRelationshipInputEnvelope
    set?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    disconnect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    delete?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    connect?: RelationshipNoteWhereUniqueInput | RelationshipNoteWhereUniqueInput[]
    update?: RelationshipNoteUpdateWithWhereUniqueWithoutClientRelationshipInput | RelationshipNoteUpdateWithWhereUniqueWithoutClientRelationshipInput[]
    updateMany?: RelationshipNoteUpdateManyWithWhereWithoutClientRelationshipInput | RelationshipNoteUpdateManyWithWhereWithoutClientRelationshipInput[]
    deleteMany?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
  }

  export type VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput = {
    create?: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput> | VisitHistoryCreateWithoutClientRelationshipInput[] | VisitHistoryUncheckedCreateWithoutClientRelationshipInput[]
    connectOrCreate?: VisitHistoryCreateOrConnectWithoutClientRelationshipInput | VisitHistoryCreateOrConnectWithoutClientRelationshipInput[]
    upsert?: VisitHistoryUpsertWithWhereUniqueWithoutClientRelationshipInput | VisitHistoryUpsertWithWhereUniqueWithoutClientRelationshipInput[]
    createMany?: VisitHistoryCreateManyClientRelationshipInputEnvelope
    set?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    disconnect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    delete?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    connect?: VisitHistoryWhereUniqueInput | VisitHistoryWhereUniqueInput[]
    update?: VisitHistoryUpdateWithWhereUniqueWithoutClientRelationshipInput | VisitHistoryUpdateWithWhereUniqueWithoutClientRelationshipInput[]
    updateMany?: VisitHistoryUpdateManyWithWhereWithoutClientRelationshipInput | VisitHistoryUpdateManyWithWhereWithoutClientRelationshipInput[]
    deleteMany?: VisitHistoryScalarWhereInput | VisitHistoryScalarWhereInput[]
  }

  export type StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput = {
    create?: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput> | StaffCreateWithoutPreferredByClientsInput[] | StaffUncheckedCreateWithoutPreferredByClientsInput[]
    connectOrCreate?: StaffCreateOrConnectWithoutPreferredByClientsInput | StaffCreateOrConnectWithoutPreferredByClientsInput[]
    upsert?: StaffUpsertWithWhereUniqueWithoutPreferredByClientsInput | StaffUpsertWithWhereUniqueWithoutPreferredByClientsInput[]
    set?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    disconnect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    delete?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    connect?: StaffWhereUniqueInput | StaffWhereUniqueInput[]
    update?: StaffUpdateWithWhereUniqueWithoutPreferredByClientsInput | StaffUpdateWithWhereUniqueWithoutPreferredByClientsInput[]
    updateMany?: StaffUpdateManyWithWhereWithoutPreferredByClientsInput | StaffUpdateManyWithWhereWithoutPreferredByClientsInput[]
    deleteMany?: StaffScalarWhereInput | StaffScalarWhereInput[]
  }

  export type ClientRelationshipCreateNestedOneWithoutVisitHistoryInput = {
    create?: XOR<ClientRelationshipCreateWithoutVisitHistoryInput, ClientRelationshipUncheckedCreateWithoutVisitHistoryInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutVisitHistoryInput
    connect?: ClientRelationshipWhereUniqueInput
  }

  export type ClientRelationshipUpdateOneRequiredWithoutVisitHistoryNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutVisitHistoryInput, ClientRelationshipUncheckedCreateWithoutVisitHistoryInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutVisitHistoryInput
    upsert?: ClientRelationshipUpsertWithoutVisitHistoryInput
    connect?: ClientRelationshipWhereUniqueInput
    update?: XOR<XOR<ClientRelationshipUpdateToOneWithWhereWithoutVisitHistoryInput, ClientRelationshipUpdateWithoutVisitHistoryInput>, ClientRelationshipUncheckedUpdateWithoutVisitHistoryInput>
  }

  export type StaffCreateNestedOneWithoutRelationshipNotesInput = {
    create?: XOR<StaffCreateWithoutRelationshipNotesInput, StaffUncheckedCreateWithoutRelationshipNotesInput>
    connectOrCreate?: StaffCreateOrConnectWithoutRelationshipNotesInput
    connect?: StaffWhereUniqueInput
  }

  export type ClientRelationshipCreateNestedOneWithoutNoteHistoryInput = {
    create?: XOR<ClientRelationshipCreateWithoutNoteHistoryInput, ClientRelationshipUncheckedCreateWithoutNoteHistoryInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutNoteHistoryInput
    connect?: ClientRelationshipWhereUniqueInput
  }

  export type EnumNoteTypeFieldUpdateOperationsInput = {
    set?: $Enums.NoteType
  }

  export type StaffUpdateOneRequiredWithoutRelationshipNotesNestedInput = {
    create?: XOR<StaffCreateWithoutRelationshipNotesInput, StaffUncheckedCreateWithoutRelationshipNotesInput>
    connectOrCreate?: StaffCreateOrConnectWithoutRelationshipNotesInput
    upsert?: StaffUpsertWithoutRelationshipNotesInput
    connect?: StaffWhereUniqueInput
    update?: XOR<XOR<StaffUpdateToOneWithWhereWithoutRelationshipNotesInput, StaffUpdateWithoutRelationshipNotesInput>, StaffUncheckedUpdateWithoutRelationshipNotesInput>
  }

  export type ClientRelationshipUpdateOneRequiredWithoutNoteHistoryNestedInput = {
    create?: XOR<ClientRelationshipCreateWithoutNoteHistoryInput, ClientRelationshipUncheckedCreateWithoutNoteHistoryInput>
    connectOrCreate?: ClientRelationshipCreateOrConnectWithoutNoteHistoryInput
    upsert?: ClientRelationshipUpsertWithoutNoteHistoryInput
    connect?: ClientRelationshipWhereUniqueInput
    update?: XOR<XOR<ClientRelationshipUpdateToOneWithWhereWithoutNoteHistoryInput, ClientRelationshipUpdateWithoutNoteHistoryInput>, ClientRelationshipUncheckedUpdateWithoutNoteHistoryInput>
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

  export type NestedEnumBusinessTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BusinessType | EnumBusinessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBusinessTypeFilter<$PrismaModel> | $Enums.BusinessType
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

  export type NestedEnumBusinessTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BusinessType | EnumBusinessTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BusinessType[] | ListEnumBusinessTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBusinessTypeWithAggregatesFilter<$PrismaModel> | $Enums.BusinessType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBusinessTypeFilter<$PrismaModel>
    _max?: NestedEnumBusinessTypeFilter<$PrismaModel>
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
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumStaffRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | EnumStaffRoleFieldRefInput<$PrismaModel>
    in?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumStaffRoleFilter<$PrismaModel> | $Enums.StaffRole
  }

  export type NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StaffRole | EnumStaffRoleFieldRefInput<$PrismaModel>
    in?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.StaffRole[] | ListEnumStaffRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumStaffRoleWithAggregatesFilter<$PrismaModel> | $Enums.StaffRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStaffRoleFilter<$PrismaModel>
    _max?: NestedEnumStaffRoleFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumAppointmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusFilter<$PrismaModel> | $Enums.AppointmentStatus
  }

  export type NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AppointmentStatus | EnumAppointmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AppointmentStatus[] | ListEnumAppointmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAppointmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.AppointmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAppointmentStatusFilter<$PrismaModel>
    _max?: NestedEnumAppointmentStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumClientStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatus | EnumClientStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatusFilter<$PrismaModel> | $Enums.ClientStatus
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

  export type NestedEnumClientStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatus | EnumClientStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatus[] | ListEnumClientStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClientStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientStatusFilter<$PrismaModel>
    _max?: NestedEnumClientStatusFilter<$PrismaModel>
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

  export type NestedEnumNoteTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeFilter<$PrismaModel> | $Enums.NoteType
  }

  export type NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NoteType | EnumNoteTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NoteType[] | ListEnumNoteTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNoteTypeWithAggregatesFilter<$PrismaModel> | $Enums.NoteType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNoteTypeFilter<$PrismaModel>
    _max?: NestedEnumNoteTypeFilter<$PrismaModel>
  }

  export type AppointmentCreateWithoutBusinessInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutAppointmentsInput
    service: ServiceCreateNestedOneWithoutAppointmentsInput
    staff: StaffCreateNestedOneWithoutAppointmentsInput
    payment?: PaymentCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutBusinessInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    clientId: string
    serviceId: string
    staffId: string
    payment?: PaymentUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutBusinessInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput>
  }

  export type AppointmentCreateManyBusinessInputEnvelope = {
    data: AppointmentCreateManyBusinessInput | AppointmentCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type BusinessHoursCreateWithoutBusinessInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
  }

  export type BusinessHoursUncheckedCreateWithoutBusinessInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
  }

  export type BusinessHoursCreateOrConnectWithoutBusinessInput = {
    where: BusinessHoursWhereUniqueInput
    create: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput>
  }

  export type BusinessHoursCreateManyBusinessInputEnvelope = {
    data: BusinessHoursCreateManyBusinessInput | BusinessHoursCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ClientRelationshipCreateWithoutBusinessInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    client: ClientCreateNestedOneWithoutRelationshipInput
    noteHistory?: RelationshipNoteCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUncheckedCreateWithoutBusinessInput = {
    id?: string
    clientId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    noteHistory?: RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipCreateOrConnectWithoutBusinessInput = {
    where: ClientRelationshipWhereUniqueInput
    create: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput>
  }

  export type ClientRelationshipCreateManyBusinessInputEnvelope = {
    data: ClientRelationshipCreateManyBusinessInput | ClientRelationshipCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ClientCreateWithoutBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoCreateNestedOneWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipUncheckedCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedCreateNestedOneWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutBusinessInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput>
  }

  export type ClientCreateManyBusinessInputEnvelope = {
    data: ClientCreateManyBusinessInput | ClientCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ServiceCategoryCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    services?: ServiceCreateNestedManyWithoutCategoryInput
  }

  export type ServiceCategoryUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    services?: ServiceUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type ServiceCategoryCreateOrConnectWithoutBusinessInput = {
    where: ServiceCategoryWhereUniqueInput
    create: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput>
  }

  export type ServiceCategoryCreateManyBusinessInputEnvelope = {
    data: ServiceCategoryCreateManyBusinessInput | ServiceCategoryCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type ServiceCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutServiceInput
    category?: ServiceCategoryCreateNestedOneWithoutServicesInput
    providers?: StaffCreateNestedManyWithoutServicesInput
  }

  export type ServiceUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    categoryId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutServiceInput
    providers?: StaffUncheckedCreateNestedManyWithoutServicesInput
  }

  export type ServiceCreateOrConnectWithoutBusinessInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput>
  }

  export type ServiceCreateManyBusinessInputEnvelope = {
    data: ServiceCreateManyBusinessInput | ServiceCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type StaffCreateWithoutBusinessInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateWithoutBusinessInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffCreateOrConnectWithoutBusinessInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput>
  }

  export type StaffCreateManyBusinessInputEnvelope = {
    data: StaffCreateManyBusinessInput | StaffCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutBusinessInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutBusinessInput, AppointmentUncheckedUpdateWithoutBusinessInput>
    create: XOR<AppointmentCreateWithoutBusinessInput, AppointmentUncheckedCreateWithoutBusinessInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutBusinessInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutBusinessInput, AppointmentUncheckedUpdateWithoutBusinessInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutBusinessInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutBusinessInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumAppointmentStatusFilter<"Appointment"> | $Enums.AppointmentStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    updatedAt?: DateTimeFilter<"Appointment"> | Date | string
    businessId?: StringFilter<"Appointment"> | string
    clientId?: StringFilter<"Appointment"> | string
    serviceId?: StringFilter<"Appointment"> | string
    staffId?: StringFilter<"Appointment"> | string
  }

  export type BusinessHoursUpsertWithWhereUniqueWithoutBusinessInput = {
    where: BusinessHoursWhereUniqueInput
    update: XOR<BusinessHoursUpdateWithoutBusinessInput, BusinessHoursUncheckedUpdateWithoutBusinessInput>
    create: XOR<BusinessHoursCreateWithoutBusinessInput, BusinessHoursUncheckedCreateWithoutBusinessInput>
  }

  export type BusinessHoursUpdateWithWhereUniqueWithoutBusinessInput = {
    where: BusinessHoursWhereUniqueInput
    data: XOR<BusinessHoursUpdateWithoutBusinessInput, BusinessHoursUncheckedUpdateWithoutBusinessInput>
  }

  export type BusinessHoursUpdateManyWithWhereWithoutBusinessInput = {
    where: BusinessHoursScalarWhereInput
    data: XOR<BusinessHoursUpdateManyMutationInput, BusinessHoursUncheckedUpdateManyWithoutBusinessInput>
  }

  export type BusinessHoursScalarWhereInput = {
    AND?: BusinessHoursScalarWhereInput | BusinessHoursScalarWhereInput[]
    OR?: BusinessHoursScalarWhereInput[]
    NOT?: BusinessHoursScalarWhereInput | BusinessHoursScalarWhereInput[]
    id?: StringFilter<"BusinessHours"> | string
    dayOfWeek?: IntFilter<"BusinessHours"> | number
    startTime?: StringFilter<"BusinessHours"> | string
    endTime?: StringFilter<"BusinessHours"> | string
    isClosed?: BoolFilter<"BusinessHours"> | boolean
    businessId?: StringFilter<"BusinessHours"> | string
  }

  export type ClientRelationshipUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ClientRelationshipWhereUniqueInput
    update: XOR<ClientRelationshipUpdateWithoutBusinessInput, ClientRelationshipUncheckedUpdateWithoutBusinessInput>
    create: XOR<ClientRelationshipCreateWithoutBusinessInput, ClientRelationshipUncheckedCreateWithoutBusinessInput>
  }

  export type ClientRelationshipUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ClientRelationshipWhereUniqueInput
    data: XOR<ClientRelationshipUpdateWithoutBusinessInput, ClientRelationshipUncheckedUpdateWithoutBusinessInput>
  }

  export type ClientRelationshipUpdateManyWithWhereWithoutBusinessInput = {
    where: ClientRelationshipScalarWhereInput
    data: XOR<ClientRelationshipUpdateManyMutationInput, ClientRelationshipUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ClientRelationshipScalarWhereInput = {
    AND?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
    OR?: ClientRelationshipScalarWhereInput[]
    NOT?: ClientRelationshipScalarWhereInput | ClientRelationshipScalarWhereInput[]
    id?: StringFilter<"ClientRelationship"> | string
    clientId?: StringFilter<"ClientRelationship"> | string
    businessId?: StringFilter<"ClientRelationship"> | string
    status?: EnumClientStatusFilter<"ClientRelationship"> | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFilter<"ClientRelationship"> | Date | string
    lastVisit?: DateTimeNullableFilter<"ClientRelationship"> | Date | string | null
    visitFrequency?: IntNullableFilter<"ClientRelationship"> | number | null
    lifetimeValue?: DecimalNullableFilter<"ClientRelationship"> | Decimal | DecimalJsLike | number | string | null
    preferences?: JsonNullableFilter<"ClientRelationship">
    internalNotes?: StringNullableFilter<"ClientRelationship"> | string | null
    flags?: EnumClientFlagNullableListFilter<"ClientRelationship">
    createdAt?: DateTimeFilter<"ClientRelationship"> | Date | string
    updatedAt?: DateTimeFilter<"ClientRelationship"> | Date | string
  }

  export type ClientUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutBusinessInput, ClientUncheckedUpdateWithoutBusinessInput>
    create: XOR<ClientCreateWithoutBusinessInput, ClientUncheckedCreateWithoutBusinessInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutBusinessInput, ClientUncheckedUpdateWithoutBusinessInput>
  }

  export type ClientUpdateManyWithWhereWithoutBusinessInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ClientScalarWhereInput = {
    AND?: ClientScalarWhereInput | ClientScalarWhereInput[]
    OR?: ClientScalarWhereInput[]
    NOT?: ClientScalarWhereInput | ClientScalarWhereInput[]
    id?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    businessId?: StringFilter<"Client"> | string
  }

  export type ServiceCategoryUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ServiceCategoryWhereUniqueInput
    update: XOR<ServiceCategoryUpdateWithoutBusinessInput, ServiceCategoryUncheckedUpdateWithoutBusinessInput>
    create: XOR<ServiceCategoryCreateWithoutBusinessInput, ServiceCategoryUncheckedCreateWithoutBusinessInput>
  }

  export type ServiceCategoryUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ServiceCategoryWhereUniqueInput
    data: XOR<ServiceCategoryUpdateWithoutBusinessInput, ServiceCategoryUncheckedUpdateWithoutBusinessInput>
  }

  export type ServiceCategoryUpdateManyWithWhereWithoutBusinessInput = {
    where: ServiceCategoryScalarWhereInput
    data: XOR<ServiceCategoryUpdateManyMutationInput, ServiceCategoryUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ServiceCategoryScalarWhereInput = {
    AND?: ServiceCategoryScalarWhereInput | ServiceCategoryScalarWhereInput[]
    OR?: ServiceCategoryScalarWhereInput[]
    NOT?: ServiceCategoryScalarWhereInput | ServiceCategoryScalarWhereInput[]
    id?: StringFilter<"ServiceCategory"> | string
    name?: StringFilter<"ServiceCategory"> | string
    description?: StringNullableFilter<"ServiceCategory"> | string | null
    color?: StringNullableFilter<"ServiceCategory"> | string | null
    createdAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    updatedAt?: DateTimeFilter<"ServiceCategory"> | Date | string
    businessId?: StringFilter<"ServiceCategory"> | string
  }

  export type ServiceUpsertWithWhereUniqueWithoutBusinessInput = {
    where: ServiceWhereUniqueInput
    update: XOR<ServiceUpdateWithoutBusinessInput, ServiceUncheckedUpdateWithoutBusinessInput>
    create: XOR<ServiceCreateWithoutBusinessInput, ServiceUncheckedCreateWithoutBusinessInput>
  }

  export type ServiceUpdateWithWhereUniqueWithoutBusinessInput = {
    where: ServiceWhereUniqueInput
    data: XOR<ServiceUpdateWithoutBusinessInput, ServiceUncheckedUpdateWithoutBusinessInput>
  }

  export type ServiceUpdateManyWithWhereWithoutBusinessInput = {
    where: ServiceScalarWhereInput
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyWithoutBusinessInput>
  }

  export type ServiceScalarWhereInput = {
    AND?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
    OR?: ServiceScalarWhereInput[]
    NOT?: ServiceScalarWhereInput | ServiceScalarWhereInput[]
    id?: StringFilter<"Service"> | string
    name?: StringFilter<"Service"> | string
    description?: StringNullableFilter<"Service"> | string | null
    duration?: IntFilter<"Service"> | number
    price?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    businessId?: StringFilter<"Service"> | string
    categoryId?: StringNullableFilter<"Service"> | string | null
  }

  export type StaffUpsertWithWhereUniqueWithoutBusinessInput = {
    where: StaffWhereUniqueInput
    update: XOR<StaffUpdateWithoutBusinessInput, StaffUncheckedUpdateWithoutBusinessInput>
    create: XOR<StaffCreateWithoutBusinessInput, StaffUncheckedCreateWithoutBusinessInput>
  }

  export type StaffUpdateWithWhereUniqueWithoutBusinessInput = {
    where: StaffWhereUniqueInput
    data: XOR<StaffUpdateWithoutBusinessInput, StaffUncheckedUpdateWithoutBusinessInput>
  }

  export type StaffUpdateManyWithWhereWithoutBusinessInput = {
    where: StaffScalarWhereInput
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyWithoutBusinessInput>
  }

  export type StaffScalarWhereInput = {
    AND?: StaffScalarWhereInput | StaffScalarWhereInput[]
    OR?: StaffScalarWhereInput[]
    NOT?: StaffScalarWhereInput | StaffScalarWhereInput[]
    id?: StringFilter<"Staff"> | string
    email?: StringFilter<"Staff"> | string
    name?: StringFilter<"Staff"> | string
    role?: EnumStaffRoleFilter<"Staff"> | $Enums.StaffRole
    createdAt?: DateTimeFilter<"Staff"> | Date | string
    updatedAt?: DateTimeFilter<"Staff"> | Date | string
    businessId?: StringFilter<"Staff"> | string
  }

  export type AppointmentCreateWithoutStaffInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAppointmentsInput
    client: ClientCreateNestedOneWithoutAppointmentsInput
    service: ServiceCreateNestedOneWithoutAppointmentsInput
    payment?: PaymentCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutStaffInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    serviceId: string
    payment?: PaymentUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutStaffInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput>
  }

  export type AppointmentCreateManyStaffInputEnvelope = {
    data: AppointmentCreateManyStaffInput | AppointmentCreateManyStaffInput[]
    skipDuplicates?: boolean
  }

  export type RelationshipNoteCreateWithoutCreatedByInput = {
    id?: string
    noteType: $Enums.NoteType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    clientRelationship: ClientRelationshipCreateNestedOneWithoutNoteHistoryInput
  }

  export type RelationshipNoteUncheckedCreateWithoutCreatedByInput = {
    id?: string
    relationshipId: string
    noteType: $Enums.NoteType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RelationshipNoteCreateOrConnectWithoutCreatedByInput = {
    where: RelationshipNoteWhereUniqueInput
    create: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput>
  }

  export type RelationshipNoteCreateManyCreatedByInputEnvelope = {
    data: RelationshipNoteCreateManyCreatedByInput | RelationshipNoteCreateManyCreatedByInput[]
    skipDuplicates?: boolean
  }

  export type ScheduleCreateWithoutStaffInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type ScheduleUncheckedCreateWithoutStaffInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type ScheduleCreateOrConnectWithoutStaffInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput>
  }

  export type ScheduleCreateManyStaffInputEnvelope = {
    data: ScheduleCreateManyStaffInput | ScheduleCreateManyStaffInput[]
    skipDuplicates?: boolean
  }

  export type BusinessCreateWithoutStaffInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutStaffInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutStaffInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutStaffInput, BusinessUncheckedCreateWithoutStaffInput>
  }

  export type ClientRelationshipCreateWithoutPreferredStaffInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutClientRelationshipsInput
    client: ClientCreateNestedOneWithoutRelationshipInput
    noteHistory?: RelationshipNoteCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryCreateNestedManyWithoutClientRelationshipInput
  }

  export type ClientRelationshipUncheckedCreateWithoutPreferredStaffInput = {
    id?: string
    clientId: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    noteHistory?: RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput
  }

  export type ClientRelationshipCreateOrConnectWithoutPreferredStaffInput = {
    where: ClientRelationshipWhereUniqueInput
    create: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput>
  }

  export type ServiceCreateWithoutProvidersInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutServiceInput
    business: BusinessCreateNestedOneWithoutServicesInput
    category?: ServiceCategoryCreateNestedOneWithoutServicesInput
  }

  export type ServiceUncheckedCreateWithoutProvidersInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    categoryId?: string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutProvidersInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput>
  }

  export type AppointmentUpsertWithWhereUniqueWithoutStaffInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutStaffInput, AppointmentUncheckedUpdateWithoutStaffInput>
    create: XOR<AppointmentCreateWithoutStaffInput, AppointmentUncheckedCreateWithoutStaffInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutStaffInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutStaffInput, AppointmentUncheckedUpdateWithoutStaffInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutStaffInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutStaffInput>
  }

  export type RelationshipNoteUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: RelationshipNoteWhereUniqueInput
    update: XOR<RelationshipNoteUpdateWithoutCreatedByInput, RelationshipNoteUncheckedUpdateWithoutCreatedByInput>
    create: XOR<RelationshipNoteCreateWithoutCreatedByInput, RelationshipNoteUncheckedCreateWithoutCreatedByInput>
  }

  export type RelationshipNoteUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: RelationshipNoteWhereUniqueInput
    data: XOR<RelationshipNoteUpdateWithoutCreatedByInput, RelationshipNoteUncheckedUpdateWithoutCreatedByInput>
  }

  export type RelationshipNoteUpdateManyWithWhereWithoutCreatedByInput = {
    where: RelationshipNoteScalarWhereInput
    data: XOR<RelationshipNoteUpdateManyMutationInput, RelationshipNoteUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type RelationshipNoteScalarWhereInput = {
    AND?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
    OR?: RelationshipNoteScalarWhereInput[]
    NOT?: RelationshipNoteScalarWhereInput | RelationshipNoteScalarWhereInput[]
    id?: StringFilter<"RelationshipNote"> | string
    relationshipId?: StringFilter<"RelationshipNote"> | string
    noteType?: EnumNoteTypeFilter<"RelationshipNote"> | $Enums.NoteType
    content?: StringFilter<"RelationshipNote"> | string
    createdById?: StringFilter<"RelationshipNote"> | string
    createdAt?: DateTimeFilter<"RelationshipNote"> | Date | string
    updatedAt?: DateTimeFilter<"RelationshipNote"> | Date | string
  }

  export type ScheduleUpsertWithWhereUniqueWithoutStaffInput = {
    where: ScheduleWhereUniqueInput
    update: XOR<ScheduleUpdateWithoutStaffInput, ScheduleUncheckedUpdateWithoutStaffInput>
    create: XOR<ScheduleCreateWithoutStaffInput, ScheduleUncheckedCreateWithoutStaffInput>
  }

  export type ScheduleUpdateWithWhereUniqueWithoutStaffInput = {
    where: ScheduleWhereUniqueInput
    data: XOR<ScheduleUpdateWithoutStaffInput, ScheduleUncheckedUpdateWithoutStaffInput>
  }

  export type ScheduleUpdateManyWithWhereWithoutStaffInput = {
    where: ScheduleScalarWhereInput
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyWithoutStaffInput>
  }

  export type ScheduleScalarWhereInput = {
    AND?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    OR?: ScheduleScalarWhereInput[]
    NOT?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    id?: StringFilter<"Schedule"> | string
    dayOfWeek?: IntFilter<"Schedule"> | number
    startTime?: StringFilter<"Schedule"> | string
    endTime?: StringFilter<"Schedule"> | string
    staffId?: StringFilter<"Schedule"> | string
  }

  export type BusinessUpsertWithoutStaffInput = {
    update: XOR<BusinessUpdateWithoutStaffInput, BusinessUncheckedUpdateWithoutStaffInput>
    create: XOR<BusinessCreateWithoutStaffInput, BusinessUncheckedCreateWithoutStaffInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutStaffInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutStaffInput, BusinessUncheckedUpdateWithoutStaffInput>
  }

  export type BusinessUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ClientRelationshipUpsertWithWhereUniqueWithoutPreferredStaffInput = {
    where: ClientRelationshipWhereUniqueInput
    update: XOR<ClientRelationshipUpdateWithoutPreferredStaffInput, ClientRelationshipUncheckedUpdateWithoutPreferredStaffInput>
    create: XOR<ClientRelationshipCreateWithoutPreferredStaffInput, ClientRelationshipUncheckedCreateWithoutPreferredStaffInput>
  }

  export type ClientRelationshipUpdateWithWhereUniqueWithoutPreferredStaffInput = {
    where: ClientRelationshipWhereUniqueInput
    data: XOR<ClientRelationshipUpdateWithoutPreferredStaffInput, ClientRelationshipUncheckedUpdateWithoutPreferredStaffInput>
  }

  export type ClientRelationshipUpdateManyWithWhereWithoutPreferredStaffInput = {
    where: ClientRelationshipScalarWhereInput
    data: XOR<ClientRelationshipUpdateManyMutationInput, ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffInput>
  }

  export type ServiceUpsertWithWhereUniqueWithoutProvidersInput = {
    where: ServiceWhereUniqueInput
    update: XOR<ServiceUpdateWithoutProvidersInput, ServiceUncheckedUpdateWithoutProvidersInput>
    create: XOR<ServiceCreateWithoutProvidersInput, ServiceUncheckedCreateWithoutProvidersInput>
  }

  export type ServiceUpdateWithWhereUniqueWithoutProvidersInput = {
    where: ServiceWhereUniqueInput
    data: XOR<ServiceUpdateWithoutProvidersInput, ServiceUncheckedUpdateWithoutProvidersInput>
  }

  export type ServiceUpdateManyWithWhereWithoutProvidersInput = {
    where: ServiceScalarWhereInput
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyWithoutProvidersInput>
  }

  export type BusinessCreateWithoutCategoriesInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutCategoriesInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutCategoriesInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutCategoriesInput, BusinessUncheckedCreateWithoutCategoriesInput>
  }

  export type ServiceCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutServiceInput
    business: BusinessCreateNestedOneWithoutServicesInput
    providers?: StaffCreateNestedManyWithoutServicesInput
  }

  export type ServiceUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutServiceInput
    providers?: StaffUncheckedCreateNestedManyWithoutServicesInput
  }

  export type ServiceCreateOrConnectWithoutCategoryInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput>
  }

  export type ServiceCreateManyCategoryInputEnvelope = {
    data: ServiceCreateManyCategoryInput | ServiceCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutCategoriesInput = {
    update: XOR<BusinessUpdateWithoutCategoriesInput, BusinessUncheckedUpdateWithoutCategoriesInput>
    create: XOR<BusinessCreateWithoutCategoriesInput, BusinessUncheckedCreateWithoutCategoriesInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutCategoriesInput, BusinessUncheckedUpdateWithoutCategoriesInput>
  }

  export type BusinessUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ServiceUpsertWithWhereUniqueWithoutCategoryInput = {
    where: ServiceWhereUniqueInput
    update: XOR<ServiceUpdateWithoutCategoryInput, ServiceUncheckedUpdateWithoutCategoryInput>
    create: XOR<ServiceCreateWithoutCategoryInput, ServiceUncheckedCreateWithoutCategoryInput>
  }

  export type ServiceUpdateWithWhereUniqueWithoutCategoryInput = {
    where: ServiceWhereUniqueInput
    data: XOR<ServiceUpdateWithoutCategoryInput, ServiceUncheckedUpdateWithoutCategoryInput>
  }

  export type ServiceUpdateManyWithWhereWithoutCategoryInput = {
    where: ServiceScalarWhereInput
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyWithoutCategoryInput>
  }

  export type AppointmentCreateWithoutClientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAppointmentsInput
    service: ServiceCreateNestedOneWithoutAppointmentsInput
    staff: StaffCreateNestedOneWithoutAppointmentsInput
    payment?: PaymentCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutClientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    serviceId: string
    staffId: string
    payment?: PaymentUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput>
  }

  export type AppointmentCreateManyClientInputEnvelope = {
    data: AppointmentCreateManyClientInput | AppointmentCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type ClientRelationshipCreateWithoutClientInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutClientRelationshipsInput
    noteHistory?: RelationshipNoteCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUncheckedCreateWithoutClientInput = {
    id?: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    noteHistory?: RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput
    visitHistory?: VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipCreateOrConnectWithoutClientInput = {
    where: ClientRelationshipWhereUniqueInput
    create: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
  }

  export type ClientSensitiveInfoCreateWithoutClientInput = {
    id?: string
    email: string
    notes?: string | null
    medicalInfo?: string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    encryptionStatus?: boolean
    lastAccessedAt?: Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoUncheckedCreateWithoutClientInput = {
    id?: string
    email: string
    notes?: string | null
    medicalInfo?: string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    encryptionStatus?: boolean
    lastAccessedAt?: Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoCreateOrConnectWithoutClientInput = {
    where: ClientSensitiveInfoWhereUniqueInput
    create: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
  }

  export type BusinessCreateWithoutClientsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutClientsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutClientsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutClientsInput, BusinessUncheckedCreateWithoutClientsInput>
  }

  export type AppointmentUpsertWithWhereUniqueWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutClientInput, AppointmentUncheckedUpdateWithoutClientInput>
    create: XOR<AppointmentCreateWithoutClientInput, AppointmentUncheckedCreateWithoutClientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutClientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutClientInput, AppointmentUncheckedUpdateWithoutClientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutClientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutClientInput>
  }

  export type ClientRelationshipUpsertWithoutClientInput = {
    update: XOR<ClientRelationshipUpdateWithoutClientInput, ClientRelationshipUncheckedUpdateWithoutClientInput>
    create: XOR<ClientRelationshipCreateWithoutClientInput, ClientRelationshipUncheckedCreateWithoutClientInput>
    where?: ClientRelationshipWhereInput
  }

  export type ClientRelationshipUpdateToOneWithWhereWithoutClientInput = {
    where?: ClientRelationshipWhereInput
    data: XOR<ClientRelationshipUpdateWithoutClientInput, ClientRelationshipUncheckedUpdateWithoutClientInput>
  }

  export type ClientRelationshipUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput
    noteHistory?: RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    noteHistory?: RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientSensitiveInfoUpsertWithoutClientInput = {
    update: XOR<ClientSensitiveInfoUpdateWithoutClientInput, ClientSensitiveInfoUncheckedUpdateWithoutClientInput>
    create: XOR<ClientSensitiveInfoCreateWithoutClientInput, ClientSensitiveInfoUncheckedCreateWithoutClientInput>
    where?: ClientSensitiveInfoWhereInput
  }

  export type ClientSensitiveInfoUpdateToOneWithWhereWithoutClientInput = {
    where?: ClientSensitiveInfoWhereInput
    data: XOR<ClientSensitiveInfoUpdateWithoutClientInput, ClientSensitiveInfoUncheckedUpdateWithoutClientInput>
  }

  export type ClientSensitiveInfoUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type ClientSensitiveInfoUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    medicalInfo?: NullableStringFieldUpdateOperationsInput | string | null
    documents?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    encryptionStatus?: BoolFieldUpdateOperationsInput | boolean
    lastAccessedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessLog?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BusinessUpsertWithoutClientsInput = {
    update: XOR<BusinessUpdateWithoutClientsInput, BusinessUncheckedUpdateWithoutClientsInput>
    create: XOR<BusinessCreateWithoutClientsInput, BusinessUncheckedCreateWithoutClientsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutClientsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutClientsInput, BusinessUncheckedUpdateWithoutClientsInput>
  }

  export type BusinessUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ClientCreateWithoutSensitiveInfoInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipCreateNestedOneWithoutClientInput
    business: BusinessCreateNestedOneWithoutClientsInput
  }

  export type ClientUncheckedCreateWithoutSensitiveInfoInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
    relationship?: ClientRelationshipUncheckedCreateNestedOneWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutSensitiveInfoInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutSensitiveInfoInput, ClientUncheckedCreateWithoutSensitiveInfoInput>
  }

  export type ClientUpsertWithoutSensitiveInfoInput = {
    update: XOR<ClientUpdateWithoutSensitiveInfoInput, ClientUncheckedUpdateWithoutSensitiveInfoInput>
    create: XOR<ClientCreateWithoutSensitiveInfoInput, ClientUncheckedCreateWithoutSensitiveInfoInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutSensitiveInfoInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutSensitiveInfoInput, ClientUncheckedUpdateWithoutSensitiveInfoInput>
  }

  export type ClientUpdateWithoutSensitiveInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUpdateOneWithoutClientNestedInput
    business?: BusinessUpdateOneRequiredWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutSensitiveInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUncheckedUpdateOneWithoutClientNestedInput
  }

  export type AppointmentCreateWithoutServiceInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAppointmentsInput
    client: ClientCreateNestedOneWithoutAppointmentsInput
    staff: StaffCreateNestedOneWithoutAppointmentsInput
    payment?: PaymentCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutServiceInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    staffId: string
    payment?: PaymentUncheckedCreateNestedOneWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutServiceInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput>
  }

  export type AppointmentCreateManyServiceInputEnvelope = {
    data: AppointmentCreateManyServiceInput | AppointmentCreateManyServiceInput[]
    skipDuplicates?: boolean
  }

  export type BusinessCreateWithoutServicesInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutServicesInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutServicesInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutServicesInput, BusinessUncheckedCreateWithoutServicesInput>
  }

  export type ServiceCategoryCreateWithoutServicesInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCategoriesInput
  }

  export type ServiceCategoryUncheckedCreateWithoutServicesInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
  }

  export type ServiceCategoryCreateOrConnectWithoutServicesInput = {
    where: ServiceCategoryWhereUniqueInput
    create: XOR<ServiceCategoryCreateWithoutServicesInput, ServiceCategoryUncheckedCreateWithoutServicesInput>
  }

  export type StaffCreateWithoutServicesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    business: BusinessCreateNestedOneWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
  }

  export type StaffUncheckedCreateWithoutServicesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
  }

  export type StaffCreateOrConnectWithoutServicesInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput>
  }

  export type AppointmentUpsertWithWhereUniqueWithoutServiceInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutServiceInput, AppointmentUncheckedUpdateWithoutServiceInput>
    create: XOR<AppointmentCreateWithoutServiceInput, AppointmentUncheckedCreateWithoutServiceInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutServiceInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutServiceInput, AppointmentUncheckedUpdateWithoutServiceInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutServiceInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutServiceInput>
  }

  export type BusinessUpsertWithoutServicesInput = {
    update: XOR<BusinessUpdateWithoutServicesInput, BusinessUncheckedUpdateWithoutServicesInput>
    create: XOR<BusinessCreateWithoutServicesInput, BusinessUncheckedCreateWithoutServicesInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutServicesInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutServicesInput, BusinessUncheckedUpdateWithoutServicesInput>
  }

  export type BusinessUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ServiceCategoryUpsertWithoutServicesInput = {
    update: XOR<ServiceCategoryUpdateWithoutServicesInput, ServiceCategoryUncheckedUpdateWithoutServicesInput>
    create: XOR<ServiceCategoryCreateWithoutServicesInput, ServiceCategoryUncheckedCreateWithoutServicesInput>
    where?: ServiceCategoryWhereInput
  }

  export type ServiceCategoryUpdateToOneWithWhereWithoutServicesInput = {
    where?: ServiceCategoryWhereInput
    data: XOR<ServiceCategoryUpdateWithoutServicesInput, ServiceCategoryUncheckedUpdateWithoutServicesInput>
  }

  export type ServiceCategoryUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type ServiceCategoryUncheckedUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type StaffUpsertWithWhereUniqueWithoutServicesInput = {
    where: StaffWhereUniqueInput
    update: XOR<StaffUpdateWithoutServicesInput, StaffUncheckedUpdateWithoutServicesInput>
    create: XOR<StaffCreateWithoutServicesInput, StaffUncheckedCreateWithoutServicesInput>
  }

  export type StaffUpdateWithWhereUniqueWithoutServicesInput = {
    where: StaffWhereUniqueInput
    data: XOR<StaffUpdateWithoutServicesInput, StaffUncheckedUpdateWithoutServicesInput>
  }

  export type StaffUpdateManyWithWhereWithoutServicesInput = {
    where: StaffScalarWhereInput
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyWithoutServicesInput>
  }

  export type BusinessCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutAppointmentsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutAppointmentsInput, BusinessUncheckedCreateWithoutAppointmentsInput>
  }

  export type ClientCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    relationship?: ClientRelationshipCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoCreateNestedOneWithoutClientInput
    business: BusinessCreateNestedOneWithoutClientsInput
  }

  export type ClientUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    relationship?: ClientRelationshipUncheckedCreateNestedOneWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedCreateNestedOneWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutAppointmentsInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
  }

  export type ServiceCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutServicesInput
    category?: ServiceCategoryCreateNestedOneWithoutServicesInput
    providers?: StaffCreateNestedManyWithoutServicesInput
  }

  export type ServiceUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    categoryId?: string | null
    providers?: StaffUncheckedCreateNestedManyWithoutServicesInput
  }

  export type ServiceCreateOrConnectWithoutAppointmentsInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutAppointmentsInput, ServiceUncheckedCreateWithoutAppointmentsInput>
  }

  export type StaffCreateWithoutAppointmentsInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    business: BusinessCreateNestedOneWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffCreateOrConnectWithoutAppointmentsInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutAppointmentsInput, StaffUncheckedCreateWithoutAppointmentsInput>
  }

  export type PaymentCreateWithoutAppointmentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentUncheckedCreateWithoutAppointmentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status: $Enums.PaymentStatus
    paymentMethod: $Enums.PaymentMethod
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutAppointmentInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
  }

  export type BusinessUpsertWithoutAppointmentsInput = {
    update: XOR<BusinessUpdateWithoutAppointmentsInput, BusinessUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<BusinessCreateWithoutAppointmentsInput, BusinessUncheckedCreateWithoutAppointmentsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutAppointmentsInput, BusinessUncheckedUpdateWithoutAppointmentsInput>
  }

  export type BusinessUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ClientUpsertWithoutAppointmentsInput = {
    update: XOR<ClientUpdateWithoutAppointmentsInput, ClientUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<ClientCreateWithoutAppointmentsInput, ClientUncheckedCreateWithoutAppointmentsInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutAppointmentsInput, ClientUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ClientUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relationship?: ClientRelationshipUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUpdateOneWithoutClientNestedInput
    business?: BusinessUpdateOneRequiredWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    relationship?: ClientRelationshipUncheckedUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedUpdateOneWithoutClientNestedInput
  }

  export type ServiceUpsertWithoutAppointmentsInput = {
    update: XOR<ServiceUpdateWithoutAppointmentsInput, ServiceUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<ServiceCreateWithoutAppointmentsInput, ServiceUncheckedCreateWithoutAppointmentsInput>
    where?: ServiceWhereInput
  }

  export type ServiceUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: ServiceWhereInput
    data: XOR<ServiceUpdateWithoutAppointmentsInput, ServiceUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ServiceUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutServicesNestedInput
    category?: ServiceCategoryUpdateOneWithoutServicesNestedInput
    providers?: StaffUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    providers?: StaffUncheckedUpdateManyWithoutServicesNestedInput
  }

  export type StaffUpsertWithoutAppointmentsInput = {
    update: XOR<StaffUpdateWithoutAppointmentsInput, StaffUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<StaffCreateWithoutAppointmentsInput, StaffUncheckedCreateWithoutAppointmentsInput>
    where?: StaffWhereInput
  }

  export type StaffUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: StaffWhereInput
    data: XOR<StaffUpdateWithoutAppointmentsInput, StaffUncheckedUpdateWithoutAppointmentsInput>
  }

  export type StaffUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type PaymentUpsertWithoutAppointmentInput = {
    update: XOR<PaymentUpdateWithoutAppointmentInput, PaymentUncheckedUpdateWithoutAppointmentInput>
    create: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
    where?: PaymentWhereInput
  }

  export type PaymentUpdateToOneWithWhereWithoutAppointmentInput = {
    where?: PaymentWhereInput
    data: XOR<PaymentUpdateWithoutAppointmentInput, PaymentUncheckedUpdateWithoutAppointmentInput>
  }

  export type PaymentUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    paymentMethod?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateWithoutPaymentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutAppointmentsInput
    client: ClientCreateNestedOneWithoutAppointmentsInput
    service: ServiceCreateNestedOneWithoutAppointmentsInput
    staff: StaffCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutPaymentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    serviceId: string
    staffId: string
  }

  export type AppointmentCreateOrConnectWithoutPaymentInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPaymentInput, AppointmentUncheckedCreateWithoutPaymentInput>
  }

  export type AppointmentUpsertWithoutPaymentInput = {
    update: XOR<AppointmentUpdateWithoutPaymentInput, AppointmentUncheckedUpdateWithoutPaymentInput>
    create: XOR<AppointmentCreateWithoutPaymentInput, AppointmentUncheckedCreateWithoutPaymentInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutPaymentInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutPaymentInput, AppointmentUncheckedUpdateWithoutPaymentInput>
  }

  export type AppointmentUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAppointmentsNestedInput
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    service?: ServiceUpdateOneRequiredWithoutAppointmentsNestedInput
    staff?: StaffUpdateOneRequiredWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type StaffCreateWithoutSchedulesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    business: BusinessCreateNestedOneWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateWithoutSchedulesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffCreateOrConnectWithoutSchedulesInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutSchedulesInput, StaffUncheckedCreateWithoutSchedulesInput>
  }

  export type StaffUpsertWithoutSchedulesInput = {
    update: XOR<StaffUpdateWithoutSchedulesInput, StaffUncheckedUpdateWithoutSchedulesInput>
    create: XOR<StaffCreateWithoutSchedulesInput, StaffUncheckedCreateWithoutSchedulesInput>
    where?: StaffWhereInput
  }

  export type StaffUpdateToOneWithWhereWithoutSchedulesInput = {
    where?: StaffWhereInput
    data: XOR<StaffUpdateWithoutSchedulesInput, StaffUncheckedUpdateWithoutSchedulesInput>
  }

  export type StaffUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type BusinessCreateWithoutBusinessHoursInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutBusinessHoursInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    clientRelationships?: ClientRelationshipUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutBusinessHoursInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutBusinessHoursInput, BusinessUncheckedCreateWithoutBusinessHoursInput>
  }

  export type BusinessUpsertWithoutBusinessHoursInput = {
    update: XOR<BusinessUpdateWithoutBusinessHoursInput, BusinessUncheckedUpdateWithoutBusinessHoursInput>
    create: XOR<BusinessCreateWithoutBusinessHoursInput, BusinessUncheckedCreateWithoutBusinessHoursInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutBusinessHoursInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutBusinessHoursInput, BusinessUncheckedUpdateWithoutBusinessHoursInput>
  }

  export type BusinessUpdateWithoutBusinessHoursInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutBusinessHoursInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    clientRelationships?: ClientRelationshipUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateWithoutClientRelationshipsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursCreateNestedManyWithoutBusinessInput
    clients?: ClientCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryCreateNestedManyWithoutBusinessInput
    services?: ServiceCreateNestedManyWithoutBusinessInput
    staff?: StaffCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutClientRelationshipsInput = {
    id?: string
    name: string
    type: $Enums.BusinessType
    createdAt?: Date | string
    updatedAt?: Date | string
    address?: string | null
    phone?: string | null
    email: string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedCreateNestedManyWithoutBusinessInput
    businessHours?: BusinessHoursUncheckedCreateNestedManyWithoutBusinessInput
    clients?: ClientUncheckedCreateNestedManyWithoutBusinessInput
    categories?: ServiceCategoryUncheckedCreateNestedManyWithoutBusinessInput
    services?: ServiceUncheckedCreateNestedManyWithoutBusinessInput
    staff?: StaffUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutClientRelationshipsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutClientRelationshipsInput, BusinessUncheckedCreateWithoutClientRelationshipsInput>
  }

  export type ClientCreateWithoutRelationshipInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoCreateNestedOneWithoutClientInput
    business: BusinessCreateNestedOneWithoutClientsInput
  }

  export type ClientUncheckedCreateWithoutRelationshipInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutClientInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedCreateNestedOneWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutRelationshipInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutRelationshipInput, ClientUncheckedCreateWithoutRelationshipInput>
  }

  export type RelationshipNoteCreateWithoutClientRelationshipInput = {
    id?: string
    noteType: $Enums.NoteType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: StaffCreateNestedOneWithoutRelationshipNotesInput
  }

  export type RelationshipNoteUncheckedCreateWithoutClientRelationshipInput = {
    id?: string
    noteType: $Enums.NoteType
    content: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RelationshipNoteCreateOrConnectWithoutClientRelationshipInput = {
    where: RelationshipNoteWhereUniqueInput
    create: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput>
  }

  export type RelationshipNoteCreateManyClientRelationshipInputEnvelope = {
    data: RelationshipNoteCreateManyClientRelationshipInput | RelationshipNoteCreateManyClientRelationshipInput[]
    skipDuplicates?: boolean
  }

  export type VisitHistoryCreateWithoutClientRelationshipInput = {
    id?: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitHistoryUncheckedCreateWithoutClientRelationshipInput = {
    id?: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitHistoryCreateOrConnectWithoutClientRelationshipInput = {
    where: VisitHistoryWhereUniqueInput
    create: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput>
  }

  export type VisitHistoryCreateManyClientRelationshipInputEnvelope = {
    data: VisitHistoryCreateManyClientRelationshipInput | VisitHistoryCreateManyClientRelationshipInput[]
    skipDuplicates?: boolean
  }

  export type StaffCreateWithoutPreferredByClientsInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    business: BusinessCreateNestedOneWithoutStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateWithoutPreferredByClientsInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    relationshipNotes?: RelationshipNoteUncheckedCreateNestedManyWithoutCreatedByInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffCreateOrConnectWithoutPreferredByClientsInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput>
  }

  export type BusinessUpsertWithoutClientRelationshipsInput = {
    update: XOR<BusinessUpdateWithoutClientRelationshipsInput, BusinessUncheckedUpdateWithoutClientRelationshipsInput>
    create: XOR<BusinessCreateWithoutClientRelationshipsInput, BusinessUncheckedCreateWithoutClientRelationshipsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutClientRelationshipsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutClientRelationshipsInput, BusinessUncheckedUpdateWithoutClientRelationshipsInput>
  }

  export type BusinessUpdateWithoutClientRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUpdateManyWithoutBusinessNestedInput
    clients?: ClientUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUpdateManyWithoutBusinessNestedInput
    services?: ServiceUpdateManyWithoutBusinessNestedInput
    staff?: StaffUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutClientRelationshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumBusinessTypeFieldUpdateOperationsInput | $Enums.BusinessType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    settings?: NullableJsonNullValueInput | InputJsonValue
    appointments?: AppointmentUncheckedUpdateManyWithoutBusinessNestedInput
    businessHours?: BusinessHoursUncheckedUpdateManyWithoutBusinessNestedInput
    clients?: ClientUncheckedUpdateManyWithoutBusinessNestedInput
    categories?: ServiceCategoryUncheckedUpdateManyWithoutBusinessNestedInput
    services?: ServiceUncheckedUpdateManyWithoutBusinessNestedInput
    staff?: StaffUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type ClientUpsertWithoutRelationshipInput = {
    update: XOR<ClientUpdateWithoutRelationshipInput, ClientUncheckedUpdateWithoutRelationshipInput>
    create: XOR<ClientCreateWithoutRelationshipInput, ClientUncheckedCreateWithoutRelationshipInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutRelationshipInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutRelationshipInput, ClientUncheckedUpdateWithoutRelationshipInput>
  }

  export type ClientUpdateWithoutRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUpdateOneWithoutClientNestedInput
    business?: BusinessUpdateOneRequiredWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedUpdateOneWithoutClientNestedInput
  }

  export type RelationshipNoteUpsertWithWhereUniqueWithoutClientRelationshipInput = {
    where: RelationshipNoteWhereUniqueInput
    update: XOR<RelationshipNoteUpdateWithoutClientRelationshipInput, RelationshipNoteUncheckedUpdateWithoutClientRelationshipInput>
    create: XOR<RelationshipNoteCreateWithoutClientRelationshipInput, RelationshipNoteUncheckedCreateWithoutClientRelationshipInput>
  }

  export type RelationshipNoteUpdateWithWhereUniqueWithoutClientRelationshipInput = {
    where: RelationshipNoteWhereUniqueInput
    data: XOR<RelationshipNoteUpdateWithoutClientRelationshipInput, RelationshipNoteUncheckedUpdateWithoutClientRelationshipInput>
  }

  export type RelationshipNoteUpdateManyWithWhereWithoutClientRelationshipInput = {
    where: RelationshipNoteScalarWhereInput
    data: XOR<RelationshipNoteUpdateManyMutationInput, RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipInput>
  }

  export type VisitHistoryUpsertWithWhereUniqueWithoutClientRelationshipInput = {
    where: VisitHistoryWhereUniqueInput
    update: XOR<VisitHistoryUpdateWithoutClientRelationshipInput, VisitHistoryUncheckedUpdateWithoutClientRelationshipInput>
    create: XOR<VisitHistoryCreateWithoutClientRelationshipInput, VisitHistoryUncheckedCreateWithoutClientRelationshipInput>
  }

  export type VisitHistoryUpdateWithWhereUniqueWithoutClientRelationshipInput = {
    where: VisitHistoryWhereUniqueInput
    data: XOR<VisitHistoryUpdateWithoutClientRelationshipInput, VisitHistoryUncheckedUpdateWithoutClientRelationshipInput>
  }

  export type VisitHistoryUpdateManyWithWhereWithoutClientRelationshipInput = {
    where: VisitHistoryScalarWhereInput
    data: XOR<VisitHistoryUpdateManyMutationInput, VisitHistoryUncheckedUpdateManyWithoutClientRelationshipInput>
  }

  export type VisitHistoryScalarWhereInput = {
    AND?: VisitHistoryScalarWhereInput | VisitHistoryScalarWhereInput[]
    OR?: VisitHistoryScalarWhereInput[]
    NOT?: VisitHistoryScalarWhereInput | VisitHistoryScalarWhereInput[]
    id?: StringFilter<"VisitHistory"> | string
    relationshipId?: StringFilter<"VisitHistory"> | string
    visitDate?: DateTimeFilter<"VisitHistory"> | Date | string
    serviceType?: StringFilter<"VisitHistory"> | string
    staffNotes?: StringNullableFilter<"VisitHistory"> | string | null
    clientFeedback?: StringNullableFilter<"VisitHistory"> | string | null
    followUpRequired?: BoolFilter<"VisitHistory"> | boolean
    createdAt?: DateTimeFilter<"VisitHistory"> | Date | string
    updatedAt?: DateTimeFilter<"VisitHistory"> | Date | string
  }

  export type StaffUpsertWithWhereUniqueWithoutPreferredByClientsInput = {
    where: StaffWhereUniqueInput
    update: XOR<StaffUpdateWithoutPreferredByClientsInput, StaffUncheckedUpdateWithoutPreferredByClientsInput>
    create: XOR<StaffCreateWithoutPreferredByClientsInput, StaffUncheckedCreateWithoutPreferredByClientsInput>
  }

  export type StaffUpdateWithWhereUniqueWithoutPreferredByClientsInput = {
    where: StaffWhereUniqueInput
    data: XOR<StaffUpdateWithoutPreferredByClientsInput, StaffUncheckedUpdateWithoutPreferredByClientsInput>
  }

  export type StaffUpdateManyWithWhereWithoutPreferredByClientsInput = {
    where: StaffScalarWhereInput
    data: XOR<StaffUpdateManyMutationInput, StaffUncheckedUpdateManyWithoutPreferredByClientsInput>
  }

  export type ClientRelationshipCreateWithoutVisitHistoryInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutClientRelationshipsInput
    client: ClientCreateNestedOneWithoutRelationshipInput
    noteHistory?: RelationshipNoteCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUncheckedCreateWithoutVisitHistoryInput = {
    id?: string
    clientId: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    noteHistory?: RelationshipNoteUncheckedCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipCreateOrConnectWithoutVisitHistoryInput = {
    where: ClientRelationshipWhereUniqueInput
    create: XOR<ClientRelationshipCreateWithoutVisitHistoryInput, ClientRelationshipUncheckedCreateWithoutVisitHistoryInput>
  }

  export type ClientRelationshipUpsertWithoutVisitHistoryInput = {
    update: XOR<ClientRelationshipUpdateWithoutVisitHistoryInput, ClientRelationshipUncheckedUpdateWithoutVisitHistoryInput>
    create: XOR<ClientRelationshipCreateWithoutVisitHistoryInput, ClientRelationshipUncheckedCreateWithoutVisitHistoryInput>
    where?: ClientRelationshipWhereInput
  }

  export type ClientRelationshipUpdateToOneWithWhereWithoutVisitHistoryInput = {
    where?: ClientRelationshipWhereInput
    data: XOR<ClientRelationshipUpdateWithoutVisitHistoryInput, ClientRelationshipUncheckedUpdateWithoutVisitHistoryInput>
  }

  export type ClientRelationshipUpdateWithoutVisitHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput
    client?: ClientUpdateOneRequiredWithoutRelationshipNestedInput
    noteHistory?: RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateWithoutVisitHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    noteHistory?: RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type StaffCreateWithoutRelationshipNotesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutStaffInput
    schedules?: ScheduleCreateNestedManyWithoutStaffInput
    business: BusinessCreateNestedOneWithoutStaffInput
    preferredByClients?: ClientRelationshipCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceCreateNestedManyWithoutProvidersInput
  }

  export type StaffUncheckedCreateWithoutRelationshipNotesInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutStaffInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutStaffInput
    preferredByClients?: ClientRelationshipUncheckedCreateNestedManyWithoutPreferredStaffInput
    services?: ServiceUncheckedCreateNestedManyWithoutProvidersInput
  }

  export type StaffCreateOrConnectWithoutRelationshipNotesInput = {
    where: StaffWhereUniqueInput
    create: XOR<StaffCreateWithoutRelationshipNotesInput, StaffUncheckedCreateWithoutRelationshipNotesInput>
  }

  export type ClientRelationshipCreateWithoutNoteHistoryInput = {
    id?: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutClientRelationshipsInput
    client: ClientCreateNestedOneWithoutRelationshipInput
    visitHistory?: VisitHistoryCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipUncheckedCreateWithoutNoteHistoryInput = {
    id?: string
    clientId: string
    businessId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
    visitHistory?: VisitHistoryUncheckedCreateNestedManyWithoutClientRelationshipInput
    preferredStaff?: StaffUncheckedCreateNestedManyWithoutPreferredByClientsInput
  }

  export type ClientRelationshipCreateOrConnectWithoutNoteHistoryInput = {
    where: ClientRelationshipWhereUniqueInput
    create: XOR<ClientRelationshipCreateWithoutNoteHistoryInput, ClientRelationshipUncheckedCreateWithoutNoteHistoryInput>
  }

  export type StaffUpsertWithoutRelationshipNotesInput = {
    update: XOR<StaffUpdateWithoutRelationshipNotesInput, StaffUncheckedUpdateWithoutRelationshipNotesInput>
    create: XOR<StaffCreateWithoutRelationshipNotesInput, StaffUncheckedCreateWithoutRelationshipNotesInput>
    where?: StaffWhereInput
  }

  export type StaffUpdateToOneWithWhereWithoutRelationshipNotesInput = {
    where?: StaffWhereInput
    data: XOR<StaffUpdateWithoutRelationshipNotesInput, StaffUncheckedUpdateWithoutRelationshipNotesInput>
  }

  export type StaffUpdateWithoutRelationshipNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateWithoutRelationshipNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type ClientRelationshipUpsertWithoutNoteHistoryInput = {
    update: XOR<ClientRelationshipUpdateWithoutNoteHistoryInput, ClientRelationshipUncheckedUpdateWithoutNoteHistoryInput>
    create: XOR<ClientRelationshipCreateWithoutNoteHistoryInput, ClientRelationshipUncheckedCreateWithoutNoteHistoryInput>
    where?: ClientRelationshipWhereInput
  }

  export type ClientRelationshipUpdateToOneWithWhereWithoutNoteHistoryInput = {
    where?: ClientRelationshipWhereInput
    data: XOR<ClientRelationshipUpdateWithoutNoteHistoryInput, ClientRelationshipUncheckedUpdateWithoutNoteHistoryInput>
  }

  export type ClientRelationshipUpdateWithoutNoteHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput
    client?: ClientUpdateOneRequiredWithoutRelationshipNestedInput
    visitHistory?: VisitHistoryUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateWithoutNoteHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    visitHistory?: VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type AppointmentCreateManyBusinessInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    clientId: string
    serviceId: string
    staffId: string
  }

  export type BusinessHoursCreateManyBusinessInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isClosed?: boolean
  }

  export type ClientRelationshipCreateManyBusinessInput = {
    id?: string
    clientId: string
    status?: $Enums.ClientStatus
    relationshipStartDate?: Date | string
    lastVisit?: Date | string | null
    visitFrequency?: number | null
    lifetimeValue?: Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: string | null
    flags?: ClientRelationshipCreateflagsInput | $Enums.ClientFlag[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientCreateManyBusinessInput = {
    id?: string
    name: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServiceCategoryCreateManyBusinessInput = {
    id?: string
    name: string
    description?: string | null
    color?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServiceCreateManyBusinessInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    categoryId?: string | null
  }

  export type StaffCreateManyBusinessInput = {
    id?: string
    email: string
    name: string
    role: $Enums.StaffRole
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    service?: ServiceUpdateOneRequiredWithoutAppointmentsNestedInput
    staff?: StaffUpdateOneRequiredWithoutAppointmentsNestedInput
    payment?: PaymentUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    payment?: PaymentUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type BusinessHoursUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BusinessHoursUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BusinessHoursUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    isClosed?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ClientRelationshipUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutRelationshipNestedInput
    noteHistory?: RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    noteHistory?: RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput
    preferredStaff?: StaffUncheckedUpdateManyWithoutPreferredByClientsNestedInput
  }

  export type ClientRelationshipUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUpdateOneWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutClientNestedInput
    relationship?: ClientRelationshipUncheckedUpdateOneWithoutClientNestedInput
    sensitiveInfo?: ClientSensitiveInfoUncheckedUpdateOneWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceCategoryUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    services?: ServiceUpdateManyWithoutCategoryNestedInput
  }

  export type ServiceCategoryUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    services?: ServiceUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type ServiceCategoryUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    color?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutServiceNestedInput
    category?: ServiceCategoryUpdateOneWithoutServicesNestedInput
    providers?: StaffUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutServiceNestedInput
    providers?: StaffUncheckedUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StaffUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyStaffInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    serviceId: string
  }

  export type RelationshipNoteCreateManyCreatedByInput = {
    id?: string
    relationshipId: string
    noteType: $Enums.NoteType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScheduleCreateManyStaffInput = {
    id?: string
    dayOfWeek: number
    startTime: string
    endTime: string
  }

  export type AppointmentUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAppointmentsNestedInput
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    service?: ServiceUpdateOneRequiredWithoutAppointmentsNestedInput
    payment?: PaymentUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    payment?: PaymentUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
  }

  export type RelationshipNoteUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    clientRelationship?: ClientRelationshipUpdateOneRequiredWithoutNoteHistoryNestedInput
  }

  export type RelationshipNoteUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationshipNoteUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    relationshipId?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleUncheckedUpdateWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleUncheckedUpdateManyWithoutStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    dayOfWeek?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
  }

  export type ClientRelationshipUpdateWithoutPreferredStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutClientRelationshipsNestedInput
    client?: ClientUpdateOneRequiredWithoutRelationshipNestedInput
    noteHistory?: RelationshipNoteUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUpdateManyWithoutClientRelationshipNestedInput
  }

  export type ClientRelationshipUncheckedUpdateWithoutPreferredStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    noteHistory?: RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipNestedInput
    visitHistory?: VisitHistoryUncheckedUpdateManyWithoutClientRelationshipNestedInput
  }

  export type ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    status?: EnumClientStatusFieldUpdateOperationsInput | $Enums.ClientStatus
    relationshipStartDate?: DateTimeFieldUpdateOperationsInput | Date | string
    lastVisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    visitFrequency?: NullableIntFieldUpdateOperationsInput | number | null
    lifetimeValue?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    preferences?: NullableJsonNullValueInput | InputJsonValue
    internalNotes?: NullableStringFieldUpdateOperationsInput | string | null
    flags?: ClientRelationshipUpdateflagsInput | $Enums.ClientFlag[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUpdateWithoutProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutServiceNestedInput
    business?: BusinessUpdateOneRequiredWithoutServicesNestedInput
    category?: ServiceCategoryUpdateOneWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateWithoutProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateManyWithoutProvidersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServiceCreateManyCategoryInput = {
    id?: string
    name: string
    description?: string | null
    duration: number
    price: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
  }

  export type ServiceUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutServiceNestedInput
    business?: BusinessUpdateOneRequiredWithoutServicesNestedInput
    providers?: StaffUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutServiceNestedInput
    providers?: StaffUncheckedUpdateManyWithoutServicesNestedInput
  }

  export type ServiceUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type AppointmentCreateManyClientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    serviceId: string
    staffId: string
  }

  export type AppointmentUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAppointmentsNestedInput
    service?: ServiceUpdateOneRequiredWithoutAppointmentsNestedInput
    staff?: StaffUpdateOneRequiredWithoutAppointmentsNestedInput
    payment?: PaymentUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    payment?: PaymentUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type AppointmentCreateManyServiceInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status: $Enums.AppointmentStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    clientId: string
    staffId: string
  }

  export type AppointmentUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutAppointmentsNestedInput
    client?: ClientUpdateOneRequiredWithoutAppointmentsNestedInput
    staff?: StaffUpdateOneRequiredWithoutAppointmentsNestedInput
    payment?: PaymentUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
    payment?: PaymentUncheckedUpdateOneWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumAppointmentStatusFieldUpdateOperationsInput | $Enums.AppointmentStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    staffId?: StringFieldUpdateOperationsInput | string
  }

  export type StaffUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUpdateManyWithoutPreferredStaffNestedInput
  }

  export type StaffUncheckedUpdateWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    preferredByClients?: ClientRelationshipUncheckedUpdateManyWithoutPreferredStaffNestedInput
  }

  export type StaffUncheckedUpdateManyWithoutServicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }

  export type RelationshipNoteCreateManyClientRelationshipInput = {
    id?: string
    noteType: $Enums.NoteType
    content: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VisitHistoryCreateManyClientRelationshipInput = {
    id?: string
    visitDate: Date | string
    serviceType: string
    staffNotes?: string | null
    clientFeedback?: string | null
    followUpRequired?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RelationshipNoteUpdateWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: StaffUpdateOneRequiredWithoutRelationshipNotesNestedInput
  }

  export type RelationshipNoteUncheckedUpdateWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RelationshipNoteUncheckedUpdateManyWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    noteType?: EnumNoteTypeFieldUpdateOperationsInput | $Enums.NoteType
    content?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryUpdateWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryUncheckedUpdateWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VisitHistoryUncheckedUpdateManyWithoutClientRelationshipInput = {
    id?: StringFieldUpdateOperationsInput | string
    visitDate?: DateTimeFieldUpdateOperationsInput | Date | string
    serviceType?: StringFieldUpdateOperationsInput | string
    staffNotes?: NullableStringFieldUpdateOperationsInput | string | null
    clientFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    followUpRequired?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StaffUpdateWithoutPreferredByClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUpdateManyWithoutStaffNestedInput
    business?: BusinessUpdateOneRequiredWithoutStaffNestedInput
    services?: ServiceUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateWithoutPreferredByClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    appointments?: AppointmentUncheckedUpdateManyWithoutStaffNestedInput
    relationshipNotes?: RelationshipNoteUncheckedUpdateManyWithoutCreatedByNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutStaffNestedInput
    services?: ServiceUncheckedUpdateManyWithoutProvidersNestedInput
  }

  export type StaffUncheckedUpdateManyWithoutPreferredByClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumStaffRoleFieldUpdateOperationsInput | $Enums.StaffRole
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use BusinessCountOutputTypeDefaultArgs instead
     */
    export type BusinessCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StaffCountOutputTypeDefaultArgs instead
     */
    export type StaffCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StaffCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceCategoryCountOutputTypeDefaultArgs instead
     */
    export type ServiceCategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceCategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientCountOutputTypeDefaultArgs instead
     */
    export type ClientCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceCountOutputTypeDefaultArgs instead
     */
    export type ServiceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientRelationshipCountOutputTypeDefaultArgs instead
     */
    export type ClientRelationshipCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientRelationshipCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BusinessDefaultArgs instead
     */
    export type BusinessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StaffDefaultArgs instead
     */
    export type StaffArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StaffDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceCategoryDefaultArgs instead
     */
    export type ServiceCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceCategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientDefaultArgs instead
     */
    export type ClientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientSensitiveInfoDefaultArgs instead
     */
    export type ClientSensitiveInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientSensitiveInfoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceDefaultArgs instead
     */
    export type ServiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AppointmentDefaultArgs instead
     */
    export type AppointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AppointmentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentDefaultArgs instead
     */
    export type PaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScheduleDefaultArgs instead
     */
    export type ScheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScheduleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BusinessHoursDefaultArgs instead
     */
    export type BusinessHoursArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BusinessHoursDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ClientRelationshipDefaultArgs instead
     */
    export type ClientRelationshipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ClientRelationshipDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VisitHistoryDefaultArgs instead
     */
    export type VisitHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VisitHistoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RelationshipNoteDefaultArgs instead
     */
    export type RelationshipNoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RelationshipNoteDefaultArgs<ExtArgs>

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