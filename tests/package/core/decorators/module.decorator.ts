import { Constructor } from "../../types/mod.ts";

export function Module(moduleName?: string) {
  return function (constructor: Constructor) {};
}
