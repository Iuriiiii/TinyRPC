import { Reflect } from "jsr:reflection";
import type { ParamDecoratorOptions } from "../mod.ts";
import { params } from "../singletons/mod.ts";
import { assert } from "jsr:assert";
import type { ParameterMetadata } from "../interfaces/mod.ts";

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
    const isOptions = isParamOptions(paramNameOrOptions);
    const paramName = isOptions ? paramNameOrOptions.name : paramNameOrOptions;
    const optional = isOptions ? paramNameOrOptions.optional : void 0;
    const type = isOptions ? paramNameOrOptions.dataType : void 0;
    const single = paramName !== undefined && paramName.length > 0;

    if (typeof paramName === "string") {
      assert(paramName.length > 0, "Param name expected.");
    }

    const paramtypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    );

    if (single) {
      const nameAlreadyExists = params.find((param) =>
        param.name === paramName
      );

      assert(!nameAlreadyExists, `Param "${paramName}" already exists.`);
    }

    params.push(
      {
        // @ts-ignore: Array access.
        dataType: type ?? paramtypes[index],
        index,
        single,
        name: paramName ?? `p${params.length}`,
        optional,
      } satisfies ParameterMetadata,
    );
  };
}
