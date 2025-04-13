import type { MethodMetadata } from "../singletons/interfaces/mod.ts";
import { getModule } from "./get-module.util.ts";

/**
 * Returns a method metadata by module and method names.
 *
 * @param moduleName - Name of the module containing the method.
 * @param methodName - Name of the method.
 * @returns Method metadata if found, undefined otherwise.
 */
export function getMethod(moduleName: string, methodName: string): MethodMetadata | undefined {
  return getModule(moduleName)?.methods.find((method) => method.name === methodName);
}
