import {
  SchemaOr,
  SchemaTuple,
  SchemaArray,
  SchemaString,
  SchemaNumber,
  SchemaObject,
  SchemaBoolean,
} from './Schema'
import {
  SchemaConfig,
  AdjustOptionalValue,
  OptionalValueToUndefined,
} from '../types'
import * as Type from './Schema.type'
import { FormatTupleToNeverTuple, MakeOptional, Prettify } from '../utils.type'

export type ExtractPrimitive<T extends Type.TypePrimitive> = T['schema'][number]

export type ExtractObject<T extends Type.TypeObject> = Prettify<
  MakeOptional<{
    [K in keyof T['schema']]: OptionalValueToUndefined<T['schema'][K]>
  }>
>

export type ExtractTuple<T extends Type.TypeTuple> = Prettify<
  FormatTupleToNeverTuple<
    {
      [K in keyof T['schema'] as K extends `${number}`
        ? K
        : never]: ExtractSchema<T['schema'][K]>
    } & Pick<T['schema'], 'length'>
  >
>

type ExtractArrayLike<T extends Type.TypeArray | Type.TypeOr> = {
  [K in keyof T['schema'] as K extends `${number}` ? K : never]: ExtractSchema<
    T['schema'][K]
  >
}

export type ExtractOr<
  T extends Type.TypeOr,
  U = ExtractArrayLike<T>
> = U[keyof U]

export type ExtractArray<
  T extends Type.TypeArray,
  U = ExtractArrayLike<T>
> = Prettify<U[keyof U][]>

export type ExtractSchemaFromAny<T> = T extends Type.Types
  ? ExtractSchema<T>
  : never

export type ExtractSchema<T extends Type.Types> =
  // Primitive:
  T extends Type.TypePrimitive
    ? AdjustOptionalValue<T, ExtractPrimitive<T>>
    : // Tuple:
    T extends Type.TypeTuple
    ? AdjustOptionalValue<T, ExtractTuple<T>>
    : // Array:
    T extends Type.TypeArray
    ? AdjustOptionalValue<T, ExtractArray<T>>
    : // Or:
    T extends Type.TypeOr
    ? AdjustOptionalValue<T, ExtractOr<T>>
    : // Object:
    T extends Type.TypeObject
    ? AdjustOptionalValue<T, ExtractObject<T>>
    : // It's never gonna happen!
      never

export type InferClassFromSchema<T, TFormat, TConfig extends SchemaConfig> =
  // String:
  T extends Type.TypeString
    ? SchemaString<TFormat extends Type.InputString ? TFormat : never, TConfig>
    : // Number:
    T extends Type.TypeNumber
    ? SchemaNumber<TFormat extends Type.InputNumber ? TFormat : never, TConfig>
    : // Boolean:
    T extends Type.TypeBoolean
    ? SchemaBoolean<
        TFormat extends Type.InputBoolean ? TFormat : never,
        TConfig
      >
    : // Tuple:
    T extends Type.TypeTuple
    ? SchemaTuple<TFormat extends Type.InputTuple ? TFormat : never, TConfig>
    : // Array:
    T extends Type.TypeArray
    ? SchemaArray<TFormat extends Type.InputArray ? TFormat : never, TConfig>
    : // Or:
    T extends Type.TypeOr
    ? SchemaOr<TFormat extends Type.InputOr ? TFormat : never, TConfig>
    : // Object:
    T extends Type.TypeObject
    ? SchemaObject<TFormat extends Type.InputObject ? TFormat : never, TConfig>
    : // It's never gonna happen!
      never
