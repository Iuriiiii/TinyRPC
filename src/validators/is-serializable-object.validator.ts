import { isClassObject } from "./mod.ts";
import { isPlainObject } from "./mod.ts";
import { isObject } from "./mod.ts";

export function isSerializableObject(value: unknown) {
  return (
    isPlainObject(value) ||
    (isObject(value) &&
      !isClassObject(value) &&
      value.constructor.name === "Serializable")
  );
}
