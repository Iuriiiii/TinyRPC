import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor, PickMembers } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, randomString, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

type PartialTypeResponse<T extends Constructor> = TypedClass<SerializableClass & PickMembers<InstanceType<T>>>;

export function partialType<T extends Constructor>(datatype: T): PartialTypeResponse<T> {
  const datatypeName = getClassName(datatype);
  const datatypeStructure = getStructure(datatypeName);

  assert(!!datatypeStructure, `"PartialType" must receive only exposed types.`);

  abstract class PartialClass extends SerializableClass {
    constructor() {
      super();
      const instance = new datatype();
      safePatch(this, instance);
    }
  }

  const structureName = `PartialOf${datatypeName}${randomString()}`;
  const structure: StructureMetadata = {
    members: datatypeStructure.members.map((member) => ({ ...member, optional: true })),
    name: structureName,
    constructor: PartialClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);
  Object.defineProperty(PartialClass, "name", { value: structureName });

  return PartialClass as unknown as PartialTypeResponse<T>;
}
