import { getStringUid } from "./get-string-uid.util.ts";
import { getObjectUid } from "./get-object-uid.util.ts";

/**
 * Calculates a unique identifier for an array of values.
 *
 * The identifier is the sum of the identifiers for each value in the array.
 * If a value is an object, its identifier is calculated with `getObjectUid`.
 * If a value is not an object, its identifier is calculated with `getStringUid`.
 *
 * @param values - Array of values to calculate the unique identifier for.
 * @returns A unique identifier for the given array of values.
 */
export function getArrayUid(values: unknown[]) {
  return values.reduce((acc: number, value: unknown) => {
    if (typeof value === "object" && value) {
      return acc + getObjectUid(value);
    }

    return acc + getStringUid(`${value}`);
  }, 0);
}
