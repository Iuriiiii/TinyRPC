import type { ClassDecorator, Constructor } from "../types/mod.ts";
import type { ExposeDecoratorOptions } from "./interfaces/mod.ts";
import { type RequireAtLeastOne, Serializable, SerializableClass, type SerializedClass } from "@online/packager";
import { members, structures } from "../singletons/mod.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getClassExtension, getStructure, getStructureDeserializer, getStructureSerializer } from "../utils/mod.ts";

export function Expose(_options?: ExposeDecoratorOptions): ClassDecorator {
  return function (target: Constructor) {
    assert(
      !isUndefined(target),
      `
The "Expose" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );

    const className = target.name;
    const extensionName = getClassExtension(target);

    if (extensionName && extensionName !== SerializableClass.name) {
      const extensionStructure = getStructure(extensionName);

      assert(extensionStructure, `The class "${className}" extends a non exposed type: "${extensionName}".`);
      members.push(...extensionStructure.members);
    }

    if (!("deserialize" in target && target.deserialize instanceof Function)) {
      // @ts-ignore: insert deserialize method
      target.deserialize = (serialized: RequireAtLeastOne<SerializedClass<Constructor>>) =>
        getStructureDeserializer(target, serialized);
    }

    if (!("serialize" in target.prototype && target.prototype.serialize instanceof Function)) {
      // @ts-ignore: insert serialize method
      target.prototype.serialize = function (): RequireAtLeastOne<SerializedClass<T>> {
        return getStructureSerializer(target, this);
      };
    }

    assert(!structures.some((structure) => structure.name === className), `The class "${className}" is already exposed.`);

    Serializable()(target);
    structures.push({
      constructor: target,
      name: className,
      members: [...members],
      isInterface: false,
      metadata: {},
    });
    members.length = 0;
  };
}
