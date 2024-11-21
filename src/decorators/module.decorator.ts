import { members, methods, modules } from "../singletons/mod.ts";
import type { Constructor } from "../types/mod.ts";

/**
 * Defines a module.
 * A module is a class that can be used as a controller, it enables to register
 * methods that can be invoked by the client.
 *
 * @param moduleName {string} The name of the module, this name will be used to identify the module on the client.
 */
// deno-lint-ignore no-explicit-any
export function Module(moduleName?: string): any {
  console.log("src/decorators/module.decorator.ts:13->Module");
  return function (target: Constructor) {
    console.log("src/decorators/module.decorator.ts:13->$Module");
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
