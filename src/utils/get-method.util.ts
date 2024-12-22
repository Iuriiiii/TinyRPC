import type { MethodMetadata } from "../singletons/interfaces/mod.ts";
import { getModule } from "./get-module.util.ts";

export function getMethod(moduleName: string, methodName: string): MethodMetadata | undefined {
  return getModule(moduleName)?.methods.find((method) => method.name === methodName);
}
