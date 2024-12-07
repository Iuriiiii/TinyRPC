import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { ArrayToIntersection, DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getClassName, getStructure } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { members } from "../../singletons/mod.ts";

// deno-lint-ignore ban-types
type CleanPartialTypeResponse<T extends Constructor[]> = TypedClass<SerializableClass & DeleteMembersByType<ArrayToIntersection<T>, Function>>;

export function cleanPartialType<T extends Constructor[]>(...types: T): CleanPartialTypeResponse<T> {
  assert(types.length > 0, "Union type must have at least one type.");

  abstract class CleanPartialClass extends SerializableClass {
    constructor() {
      super();
    }
  }

  const structures = types.map((type) => getStructure(getClassName(type)));

  assert(!structures.some(isUndefined), "PartialType must receive only exposed types.");

  const typesName = types.map((type) => getClassName(type)).join("_");
  const structureName = `PartialOf${typesName}`;
  const structure: StructureMetadata = {
    members: structures.flatMap((_module) => _module!.members).map((member) => ({ ...member, optional: true })),
    name: structureName,
    constructor: CleanPartialClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);
  members.push(...structure.members);

  Object.defineProperty(CleanPartialClass, "name", { value: structureName });

  return CleanPartialClass as unknown as CleanPartialTypeResponse<T>;
}
