import type { RequireAtLeastOne, SerializedClass } from "@online/packager";
import type { Constructor, PickMembers } from "../types/mod.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getStructure } from "./get-structure.util.ts";

export function getStructureSerializer<T extends Constructor>(
  cosntructor: Constructor,
  _this: object,
): RequireAtLeastOne<SerializedClass<T>> {
  const className = getConstructorName(cosntructor);
  const structure = getStructure(className);

  assert(structure, `The class "${className}" is not a structure.`);

  const argumentMembers = structure.members.filter((member) => !isUndefined(member.constructorParam));
  const bodyMembers = structure.members.filter((member) => isUndefined(member.constructorParam));
  // @ts-ignore: index access
  const _arguments = argumentMembers.map((member) => _this[member.name]) as ConstructorParameters<T>;
  const members = bodyMembers.reduce((acc, member) => {
    // @ts-ignore: index access
    acc[member.name] = _this[member.name];
    return acc;
  }, {} as Partial<PickMembers<InstanceType<T>>>);

  return {
    arguments: _arguments,
    members,
  };
}
