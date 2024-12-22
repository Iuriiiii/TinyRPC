import type { StructureMetadata } from "../../singletons/interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, randomString } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

type CleanTypeResponse<T extends Constructor> = TypedClass<
  SerializableClass & PickMembers<InstanceType<T>>
>;

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

  const structureName = `CleanOf${datatypeName}${randomString()}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members.map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: CleanClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);

  Object.defineProperty(CleanClass, "name", { value: structureName });

  return CleanClass as unknown as CleanTypeResponse<T>;
}
