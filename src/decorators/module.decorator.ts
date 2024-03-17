import { isClient } from "../mod.ts";
import { methods, modules } from "../singletons/mod.ts";
import { Constructor } from "../types/mod.ts";

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
