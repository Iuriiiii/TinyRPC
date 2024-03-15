import {
  isBoolean,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
} from "../mod.ts";

export function IsPrimitive(value: unknown) {
  return (
    isNull(value) ||
    isBoolean(value) ||
    isUndefined(value) ||
    isNumber(value) ||
    isString(value) ||
    isPlainObject(value)
  );
}
