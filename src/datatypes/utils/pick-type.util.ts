import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

// deno-lint-ignore ban-types
type CleanTypeResponse<T extends Constructor> = TypedClass<SerializableClass & DeleteMembersByType<T, Function>>;

/**
 * Removes all default values of a class.
 *
 * @param {Constructor} datatype Previously exposed type
 * @returns {CleanTypeResponse<T>} A type without default values
 */
export function pickType<T extends Constructor>(datatype: T, ...datatypeMembers: (keyof PickMembers<T>)[]): CleanTypeResponse<T> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);
  assert(!!datatypeStructure, `"PickType" must receive only exposed types.`);

  const areAllDatatypeMembersDeclared = datatypeMembers.every((datatypeMember) => datatypeStructure.members.some((_member) => _member.name === datatypeMember));
  assert(areAllDatatypeMembersDeclared, `"PickType" just can pick members decorated with "Member".`);

  abstract class PickClass extends SerializableClass {
    constructor() {
      super();
      const instance = new datatype();
      safePatch(this, instance, ...datatypeMembers);
    }
  }

  const structureName = `PickOf${datatypeName}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members
      .filter((member) => datatypeMembers.includes(member.name as keyof PickMembers<T>))
      .map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: PickClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);

  Object.defineProperty(PickClass, "name", { value: structureName });

  return PickClass as unknown as CleanTypeResponse<T>;
}
