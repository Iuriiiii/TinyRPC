import type { ClassDecorator, Constructor } from "../types/mod.ts";
import { SerializableClass } from "@online/packager";
import { members, methods, modules } from "../singletons/mod.ts";
import { Expose } from "./expose.decorator.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { getModuleDocs } from "../utils/mod.ts";

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

    // for (const member of members) {
    //   if (!isUndefined(member.constructorParam)) {
    //     assert(
    //       isPrimitiveConstructor(member.dataType),
    //       `Module constructor members must be primitive types, error on constructor member: ${member.name}.`,
    //     );
    //   }
    // }

    assert(identifierMembers.length <= 1, `Only one identifier member is allowed per module. Error on ${target.name}`);

    const moduleDocs = getModuleDocs(target);

    for (const method of methods) {
      method.description = moduleDocs[method.name] ?? method.description;
    }

    assert(!modules.some((module) => module.name === target.name), `Module "${target.name}" already exists.`);

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
