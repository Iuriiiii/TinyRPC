import type { ParameterMetadata } from "../singletons/interfaces/mod.ts";
import { isNumber } from "@online/is";
import { getMethod } from "./get-method.util.ts";

/**
 * Finds a parameter by name or index.
 *
 * @param moduleName - The module of the method where the param is located.
 * @param methodName - The name of the method where the param is located.
 * @param paramNameOrIndex - The name or index of the param.
 *
 * @returns The param if found, undefined if not.
 */
export function getParam(
  moduleName: string,
  methodName: string,
  paramNameOrIndex: string | number,
): ParameterMetadata | undefined {
  return getMethod(moduleName, methodName)?.params.find((param) =>
    isNumber(paramNameOrIndex) ? param.index === paramNameOrIndex : param.name === paramNameOrIndex
  );
}
