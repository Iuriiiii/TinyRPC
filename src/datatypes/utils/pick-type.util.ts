import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { ArrayToUnion } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, randomString, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

type PickTypeResponse<
  T extends Constructor,
  K extends Array<keyof PickMembers<InstanceType<T>>>,
> = TypedClass<SerializableClass & Pick<PickMembers<InstanceType<T>>, ArrayToUnion<K>>>;

/**
 * Removes all default values of a class.
 *
 * @param {Constructor} datatype Previously exposed type
 * @returns {PickTypeResponse<T>} A type without default values
 */
export function pickType<
  T extends Constructor,
  K extends Array<keyof PickMembers<InstanceType<T>>> = Array<keyof PickMembers<InstanceType<T>>>,
>(datatype: T, ...datatypeMembers: (keyof InstanceType<T>)[]): PickTypeResponse<T, K> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);
  assert(!!datatypeStructure, `"PickType" must receive only exposed types.`);

  const areAllDatatypeMembersDeclared = datatypeMembers.every((datatypeMember) =>
    datatypeStructure.members.some((_member) => _member.name === datatypeMember)
  );
  assert(areAllDatatypeMembersDeclared, `"PickType" just can pick members decorated with "Member".`);

  abstract class PickClass extends SerializableClass {
    constructor() {
      super();
      const instance = new datatype();
      safePatch(this, instance, ...datatypeMembers as string[]);
    }
  }

  const structureName = `PickOf${datatypeName}${randomString()}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members
      .filter((member) => datatypeMembers.includes(member.name as keyof InstanceType<T>))
      .map((member) => ({ ...member, defaultValue: undefined })),
    name: structureName,
    constructor: PickClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);

  Object.defineProperty(PickClass, "name", { value: structureName });

  return PickClass as unknown as PickTypeResponse<T, K>;
}
