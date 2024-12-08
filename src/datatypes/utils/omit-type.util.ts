import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { ArrayToUnion } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

type OmitTypeResponse<
  T extends Constructor,
  K extends Array<keyof PickMembers<InstanceType<T>>>,
> = TypedClass<SerializableClass & Omit<PickMembers<InstanceType<T>>, ArrayToUnion<K>>>;

/**
 * Removes all default values of a class.
 *
 * @param {Constructor} datatype Previously exposed type
 * @returns {OmitTypeResponse<T>} A type without default values
 */
export function omitType<
  T extends Constructor,
  K extends Array<keyof PickMembers<InstanceType<T>>> = Array<keyof PickMembers<InstanceType<T>>>,
>(
  datatype: T,
  ...datatypeMembers: K
): OmitTypeResponse<T, K> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);
  assert(!!datatypeStructure, `"OmitType" must receive only exposed types.`);

  const areAllDatatypeMembersDeclared = datatypeMembers.every((datatypeMember) =>
    datatypeStructure.members.some((_member) => _member.name === datatypeMember)
  );
  assert(areAllDatatypeMembersDeclared, `"OmitType" just can pick members decorated with "Member".`);

  abstract class OmitClass extends SerializableClass {
    constructor() {
      super();
      const instance = new datatype();
      safePatch(
        this,
        instance,
        ...Object.getOwnPropertyNames(instance).filter((key) => !datatypeMembers.includes(key as K[number])),
      );
    }
  }

  const structureName = `OmitOf${datatypeName}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members
      .filter((member) => !datatypeMembers.includes(member.name as K[number]))
      .map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: OmitClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);

  Object.defineProperty(OmitClass, "name", { value: structureName });

  return OmitClass as unknown as OmitTypeResponse<T, K>;
}
