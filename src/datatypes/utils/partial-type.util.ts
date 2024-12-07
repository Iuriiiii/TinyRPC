import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { getClassName, getStructure, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { structures } from "../../singletons/mod.ts";

// deno-lint-ignore ban-types
type PartialTypeResponse<T extends Constructor> = TypedClass<SerializableClass & DeleteMembersByType<T, Function>>;

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

  const structureName = `PartialOf${datatypeName}`;
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
