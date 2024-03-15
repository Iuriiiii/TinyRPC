import { isObject } from "./is-object.validator.ts";

export function isClassInstance(value: unknown): value is object {
  return (
    isObject(value) && !["Function", "Object"].includes(value.constructor.name)
  );
}
