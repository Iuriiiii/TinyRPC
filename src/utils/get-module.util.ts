import type { ModuleMetadata } from "../singletons/interfaces/mod.ts";
import { modules } from "../singletons/mod.ts";

/**
 * Returns module metadata by its name.
 *
 * @param name - Module name.
 * @returns Module metadata if found, undefined otherwise.
 */
export function getModule(name: string): ModuleMetadata | undefined {
  return modules.find((module) => module.name === name);
}
