import type { Constructor } from "../types/mod.ts";

/**
 * Returns the name of the given constructor.
 *
 * @param clazz - The constructor
 * @returns {string} The name of the constructor
 */
export function getClassName(clazz: Constructor) {
  return clazz.name;
}
