import { instances } from "../singletons/mod.ts";

/**
 * Finds a class instance by its name.
 *
 * @param name - The name of the class
 * @returns The class instance if found, or null
 */
export function getClassByName(name: string) {
  return instances.get(name) ?? null;
}
