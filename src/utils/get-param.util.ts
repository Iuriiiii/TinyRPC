import type { ParameterMetadata } from "../singletons/interfaces/mod.ts";
import { isNumber } from "@online/is";
import { getMethod } from "./get-method.util.ts";

export function getParam(
  moduleName: string,
  methodName: string,
  paramNameOrIndex: string | number,
): ParameterMetadata | undefined {
  return getMethod(moduleName, methodName)?.params.find((param) =>
    isNumber(paramNameOrIndex) ? param.index === paramNameOrIndex : param.name === paramNameOrIndex
  );
}
