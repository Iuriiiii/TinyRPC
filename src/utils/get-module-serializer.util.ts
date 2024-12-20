import type { RequireAtLeastOne, SerializedClass } from "@online/packager";
import type { Constructor, PickMembers } from "../types/mod.ts";
import { getConstructorName } from "./get-constructor-name.util.ts";
import { getModule } from "./get-module.util.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";

export function getModuleSerializer<T extends Constructor>(
  cosntructor: Constructor,
  _this: object,
): RequireAtLeastOne<SerializedClass<T>> {
  const className = getConstructorName(cosntructor);
  const module = getModule(className);

  assert(module, `The class "${className}" is not a module.`);

  const argumentMembers = module.members.filter((member) => !isUndefined(member.constructorParam));
  const bodyMembers = module.members.filter((member) => isUndefined(member.constructorParam));
  // @ts-ignore: index access
  const _arguments = argumentMembers.map((member) => _this[member.name]) as ConstructorParameters<T>;
  const members = bodyMembers.reduce((acc, member) => {
    // @ts-ignore: index access;;
    acc[member.name] = _this[member.name];
    return acc;
  }, {} as Partial<PickMembers<InstanceType<T>>>);

  return {
    arguments: _arguments,
    members,
  };
}
