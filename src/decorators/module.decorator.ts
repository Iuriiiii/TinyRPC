import type { ClassDecorator, Constructor } from "../types/mod.ts";
import { SerializableClass } from "@online/packager";
import { members, methods, modules } from "../singletons/mod.ts";
import { Expose } from "./expose.decorator.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";

/**
 * Defines a module.
 * A module is a class that can be used as a controller, it enables to register
 * methods that can be invoked by the client.
 *
 * @param moduleName {string} The name of the module, this name will be used to identify the module on the client.
 */
export function Module(moduleName?: string): ClassDecorator {
  return function (target: Constructor) {
    assert(
      !isUndefined(target),
      `
The "Module" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );

    if (target.prototype instanceof SerializableClass) {
      const preserveMembers = [...members];
      Expose()(target);
      members.push(...preserveMembers);
    }

    const identifierMembers = members.filter((m) => m.identifier);

    assert(identifierMembers.length <= 1, "Only one identifier member is allowed per module.");

    modules.push({
      constructor: target,
      name: target.name,
      methods: [...methods],
      members: [...members],
      moduleName,
    });
    methods.length = 0;
    members.length = 0;
  };
}
