import type { StructureMetadata } from "../../interfaces/mod.ts";
import type { Constructor } from "../../types/mod.ts";
import type { TypedClass } from "../interfaces/mod.ts";
import type { ArrayToIntersection, DeleteMembersByType } from "../types/mod.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getClassName, getStructure, safePatch } from "../../utils/mod.ts";
import { SerializableClass } from "@online/packager";
import { members } from "../../singletons/members.singleton.ts";

// deno-lint-ignore ban-types
type IntersectionTypeResponse<T extends Constructor[]> = TypedClass<SerializableClass & DeleteMembersByType<ArrayToIntersection<T>, Function>>;

export function intersectionType<T extends Constructor[]>(...types: T): IntersectionTypeResponse<T> {
  assert(types.length > 0, "Union type must have at least one type.");

  abstract class IntersectionClass extends SerializableClass {
    constructor() {
      super();
      for (const type of types) {
        const instance = new type();
        safePatch(this, instance);
      }
    }
  }

  const structures = types.map((type) => getStructure(getClassName(type)));

  assert(!structures.some(isUndefined), "IntersectionType must receive only exposed types.");

  const typesName = types.map((type) => getClassName(type)).join("_");
  const structureName = `IntersectionOf${typesName}`;
  const structure: StructureMetadata = {
    members: structures.flatMap((_module) => _module!.members),
    name: structureName,
    constructor: IntersectionClass as Constructor,
    isInterface: false,
  };

  structures.push(structure);
  members.push(...structure.members);

  Object.defineProperty(IntersectionClass, "name", { value: structureName });

  return IntersectionClass as unknown as IntersectionTypeResponse<T>;
}