import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { members, structures } from "../../singletons/mod.ts";

// deno-lint-ignore ban-types
type CleanTypeResponse<T extends Constructor> = TypedClass<SerializableClass & DeleteMembersByType<T, Function>>;

/**
 * Removes all default values of a class.
 *
 * @param {Constructor} datatype Previously exposed type
 * @returns {CleanTypeResponse<T>} A type without default values
 */
export function cleanType<T extends Constructor>(datatype: T): CleanTypeResponse<T> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);
  assert(!!datatypeStructure, `"CleanType" must receive only exposed types.`);

  abstract class CleanClass extends SerializableClass {
    constructor() {
      super();
    }
  }

  const structureName = `CleanOf${datatypeName}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members.map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: CleanClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);
  members.push(...structure.members);

  Object.defineProperty(CleanClass, "name", { value: structureName });

  return CleanClass as unknown as CleanTypeResponse<T>;
}