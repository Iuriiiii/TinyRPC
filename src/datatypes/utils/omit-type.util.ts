import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, safePatch } from "../../utils/mod.ts";
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
export function omitType<T extends Constructor>(datatype: T, ...datatypeMembers: (keyof PickMembers<T>)[]): CleanTypeResponse<T> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);
  assert(!!datatypeStructure, `"OmitType" must receive only exposed types.`);

  const areAllDatatypeMembersDeclared = datatypeMembers.every((datatypeMember) => datatypeStructure.members.some((_member) => _member.name === datatypeMember));
  assert(areAllDatatypeMembersDeclared, `"OmitType" just can pick members decorated with "Member".`);

  abstract class OmitClass extends SerializableClass {
    constructor() {
      super();
      const instance = new datatype();
      safePatch(this, instance, ...Object.getOwnPropertyNames(instance).filter((key) => !datatypeMembers.includes(key as keyof PickMembers<T>)));
    }
  }

  const structureName = `OmitOf${datatypeName}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members
      .filter((member) => !datatypeMembers.includes(member.name as keyof PickMembers<T>))
      .map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: OmitClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);
  members.push(...structure.members);

  Object.defineProperty(OmitClass, "name", { value: structureName });

  return OmitClass as unknown as CleanTypeResponse<T>;
}
