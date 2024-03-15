import { isObject } from "./is-object.validator.ts";

export function isPlainObject(value: unknown): value is object {
  return isObject(value) && value.constructor.name === "Object";
}
