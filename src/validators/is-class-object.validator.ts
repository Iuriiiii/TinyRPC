import { isObject } from "./mod.ts";

export function isClassObject(value: unknown) {
  return isObject(value) && value.constructor.name === "Function";
}
