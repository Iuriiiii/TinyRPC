import { isObject } from "@online/is";

export function isClassObject(value: unknown) {
  return isObject(value) && value.constructor.name === "Function";
}
