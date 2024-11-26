import { Reflect } from "@dx/reflect";
import type { ParamDecoratorOptions } from "../mod.ts";
import { params } from "../singletons/mod.ts";
import { assert } from "@std/assert";
import type { ParameterMetadata } from "../interfaces/mod.ts";
import { getParamName } from "../utils/mod.ts";

function isParamOptions(
  item?: string | Partial<ParamDecoratorOptions>,
): item is Partial<ParamDecoratorOptions> {
  return typeof item === "object";
}

/**
 * Defines a method param.
 * Tells to TinyRPC that this param is used in an exported method.
 *
 * @param paramNameOrOptions
 */
export function Param(
  paramNameOrOptions?: string | Partial<ParamDecoratorOptions>,
  // deno-lint-ignore no-explicit-any
): any {
  return function (
    /**
     * The class decored.
     */
    target: unknown,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    /**
     * The param index.
     */
    index: number,
  ) {
    // @ts-ignore: Array access.
    // deno-lint-ignore ban-types
    const methodTarget: Function = target[propertyKey];
    const isOptions = isParamOptions(paramNameOrOptions);
    const paramName = (isOptions ? paramNameOrOptions.name : paramNameOrOptions) || getParamName(methodTarget, index) || `p${params.length}`;
    const optional = isOptions ? paramNameOrOptions.optional : void 0;
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    );

    assert(paramName.length > 0, "Param name expected.");

    params.push(
      {
        index,
        optional,
        name: paramName,
        dataType: (isOptions ? paramNameOrOptions.dataType : void 0) ?? paramTypes[index],
      } satisfies ParameterMetadata,
    );
  };
}
