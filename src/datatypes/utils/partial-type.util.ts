import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { ArrayToIntersection, DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getClassName, getStructure, safePath } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";

// deno-lint-ignore ban-types
type PartialTypeResponse<T extends Constructor[]> = TypedClass<SerializableClass & DeleteMembersByType<ArrayToIntersection<T>, Function>>;

export function partialType<T extends Constructor[]>(...types: T): PartialTypeResponse<T> {
  assert(types.length > 0, "Union type must have at least one type.");

  abstract class PartialClass extends SerializableClass {
    constructor() {
      super();
      for (const type of types) {
        const instance = new type();
        safePath(this, instance);
      }
    }
  }

  const structures = types.map((type) => getStructure(getClassName(type)));

  assert(!structures.some(isUndefined), "PartialType must receive only exposed types.");

  const typesName = types.map((type) => getClassName(type)).join("_");
  const structureName = `PartialOf${typesName}`;
  const structure: StructureMetadata = {
    members: structures.flatMap((_module) => _module!.members).map((member) => ({ ...member, optional: true })),
    name: structureName,
    constructor: PartialClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);

  Object.defineProperty(PartialClass, "name", { value: structureName });

  return PartialClass as unknown as PartialTypeResponse<T>;
}
