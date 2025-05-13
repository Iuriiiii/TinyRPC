import { assert } from "@std/assert";
import { structures } from "../singletons/mod.ts";
import type { Constructor } from "../types/mod.ts";

/**
 * Renames a custom datatype.
 *
 * @param dataType The instance of the custom datatype.
 * @param name The new datatype name.
 * @returns The same custom datatype with the changed name.
 */
export function renameType(dataType: Constructor, name: string): Constructor {
  const structure = structures.find((structure) => structure.constructor === dataType);

  assert(!!structure, "Invalid datatype.");

  structure.name = name;
  Object.defineProperty(dataType, "name", { value: name });

  return dataType;
}
