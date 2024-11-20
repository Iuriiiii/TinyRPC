import { SerializableClass } from "../abstractions/mod.ts";
import { isObject } from "jsr:@online/is@^0.0.1";
import { serializableClasses } from "../singletons/mod.ts";
import { getClassName } from "../utils/mod.ts";

export function isSerializableClass(
  value: unknown,
): value is SerializableClass {
  return isObject(value) &&
    value instanceof SerializableClass &&
    serializableClasses.has(getClassName(value));
}
