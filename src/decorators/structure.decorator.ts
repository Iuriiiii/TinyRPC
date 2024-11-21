import { members, structures } from "../singletons/mod.ts";
import type { Constructor } from "../types/mod.ts";
import { Serializable } from "@online/packager";

// deno-lint-ignore no-explicit-any
export function Structure(): any {
  return function (target: Constructor) {
    Serializable()(target);
    structures.push({
      constructor: target,
      name: target.name,
      members: [...members],
    });
    members.length = 0;
  };
}
