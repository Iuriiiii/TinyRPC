import {
  isInfinity,
  isNull,
  isNumber,
  isPlainObject,
  isSerializableObject,
  isString,
  isUndefined,
  isDate,
} from "../mod.ts";

export function IsSerializable(value: unknown) {
  const filters = [
    isNumber,
    isString,
    isPlainObject,
    isSerializableObject,
    isUndefined,
    isNull,
    isDate,
    isNaN,
    isInfinity,
  ];

  // @ts-ignore: ignore `unknown` data type error.
  return filters.some((filter) => filter(value));
}
