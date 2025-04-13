import type { Constructor } from "../types/mod.ts";

/**
 * Returns the name of the given constructor.
 *
 * @param constructor - The constructor to get the name of.
 * @returns the name of the constructor.
 */
export function getConstructorName(constructor: Constructor) {
  return constructor.name;
}
