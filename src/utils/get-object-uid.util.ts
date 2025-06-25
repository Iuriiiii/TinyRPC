import { getStringUid } from "./get-string-uid.util.ts";

/**
 * Calculates a unique identifier for an object based on its key-value pairs.
 *
 * @param obj - The object to calculate the unique identifier for.
 * @returns A unique identifier for the given object.
 *
 * @remarks
 * This function is deterministic, meaning it will always return the same unique
 * identifier for the same object. The function works by summing the unique
 * identifiers for each key-value pair in the object, using the
 * `getStringUid` function to calculate the unique identifier for each value.
 */
export function getObjectUid<T extends object>(obj: T) {
  let result = 0;

  for (const [key, value] of Object.entries(obj)) {
    result += getStringUid(key);

    if (typeof value === "string") {
      result += getStringUid(value);
    } else if (typeof value === "object") {
      result += getObjectUid(value);
    } else if ("toString" in value) {
      result += getStringUid(value.toString());
    }
  }

  return result;
}
