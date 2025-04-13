import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { structures } from "../singletons/mod.ts";

/**
 * Returns the structure metadata with the given name.
 *
 * @param name The name of the structure metadata to return.
 * @returns The structure metadata with the given name, or undefined if no such structure exists.
 */
export function getStructure(name: string): StructureMetadata | undefined {
  return structures.find((structure) => structure.name === name);
}
