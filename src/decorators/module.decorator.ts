import { methods, modules } from "../singletons/mod.ts";
import { Constructor } from "../types/mod.ts";

/**
 * Defines a module.
 * A module is a class that can be used as a controller, it enables to register
 * methods that can be invoked by the client.
 *
 * @param moduleName {string} The name of the module, this name will be used to identify the module on the client.
 */
export function Module(moduleName?: string) {
  return function (target: Constructor) {
    modules.push({
      constructor: target,
      name: target.name,
      methods: [...methods],
      moduleName,
    });
    methods.length = 0;
  };
}
