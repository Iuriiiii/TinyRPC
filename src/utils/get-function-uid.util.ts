// deno-lint-ignore-file
import { getStringUid } from "./get-string-uid.util.ts";

/**
 * Generates a unique identifier for a given function, based on its toString() method.
 * This function is deterministic and will always return the same number for the same input.
 * This function is not cryptographically secure, and should not be used for cryptographic purposes.
 *
 * @param {Function} fn - The function to generate a UID for.
 * @returns {number} A unique identifier for the given function.
 */
export function getFunctionUid(fn: Function) {
  return getStringUid(fn.toString());
}
