import type { ModuleMetadata } from "../singletons/interfaces/mod.ts";
import { modules } from "../singletons/mod.ts";

export function getModule(name: string): ModuleMetadata | undefined {
  return modules.find((module) => module.name === name);
}
