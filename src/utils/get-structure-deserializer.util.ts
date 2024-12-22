import type { RequireAtLeastOne, SerializedClass } from "@online/packager";
import type { Constructor } from "../types/mod.ts";
import { isRaloSerializedClass } from "../validators/mod.ts";
import { getClassName } from "./get-class-name.util.ts";
import { getStructure } from "./get-structure.util.ts";
import { objectPick } from "./object-pick.util.ts";
import { objectPickToArray } from "./object-pick-to-array.util.ts";
import { isUndefined } from "@online/is";
import { getModule } from "./get-module.util.ts";
import type { MemberMetadata } from "../singletons/interfaces/mod.ts";

export function getStructureDeserializer<T extends Constructor>(
  clazz: T,
  serialized: RequireAtLeastOne<SerializedClass<T>> | object,
) {
  if (isRaloSerializedClass(serialized)) {
    const { arguments: _arguments = [], members = {} } = serialized;
    const instance = new clazz(..._arguments);

    return Object.assign(instance, members);
  }

  if (serialized instanceof clazz) {
    return serialized;
  }

  const getParameterNames = (members: MemberMetadata[]) =>
    members.filter((member) => !isUndefined(member.constructorParam))
      .map((member) => member.name);

  const getMemberNames = (members: MemberMetadata[]) =>
    members.filter((member) => isUndefined(member.constructorParam))
      .map((member) => member.name);

  const className = getClassName(clazz);
  const structure = getStructure(className);

  if (structure) {
    const pickArguments = objectPickToArray(
      serialized,
      getParameterNames(structure.members),
    );
    const pickMembers = objectPick(
      serialized,
      getMemberNames(structure.members),
    );

    const instance = new clazz(...pickArguments);

    return Object.assign(instance, pickMembers);
  }

  const module = getModule(className);

  if (module) {
    const pickArguments = objectPickToArray(
      serialized,
      getParameterNames(module.members),
    );
    const pickMembers = objectPick(
      serialized,
      getMemberNames(module.members),
    );

    const instance = new clazz(...pickArguments);

    return Object.assign(instance, pickMembers);
  }

  return Object.assign(new clazz(), serialized);
}
