import { methods, modules } from "../singletons/mod.ts";
import { Constructor } from "../types/mod.ts";

export function Module(moduleName?: string) {
  return function (constructor: Constructor) {
    modules.push({
      constructor,
      name: constructor.name,
      methods: [...methods],
      moduleName,
    });
    methods.length = 0;
  };
}
