import type { ParamDecoratorOptions } from "./interfaces/mod.ts";
import type { ParamDecorator } from "./types/mod.ts";
import { Reflect } from "@dx/reflect";
import { params } from "../singletons/mod.ts";
import { assert } from "@std/assert";
import { getParamName } from "../utils/mod.ts";
import { isUndefined } from "@online/is";

function isParamOptions(item?: string | Partial<ParamDecoratorOptions>): item is Partial<ParamDecoratorOptions> {
  return typeof item === "object";
}

/**
 * Defines a method param.
 * Tells to TinyRPC that this param is used in an exported method.
 *
 * @param paramNameOrOptions
 */
export function Param(paramNameOrOptions?: string | Partial<ParamDecoratorOptions>): ParamDecorator {
  return function (
    /**
     * The class decored.
     */
    // deno-lint-ignore no-explicit-any
    target: any,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    /**
     * The param index.
     */
    index: number,
  ) {
    assert(
      !isUndefined(target),
      `
The "Param" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );
    // @ts-ignore: Array access.
    // deno-lint-ignore ban-types
    const methodTarget: Function = target[propertyKey];
    const isOptions = isParamOptions(paramNameOrOptions);
    const paramName = (isOptions ? paramNameOrOptions.name : paramNameOrOptions) ||
      getParamName(methodTarget, index) ||
      `p${params.length}`;
    const optional = isOptions ? paramNameOrOptions.optional : void 0;
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    );

    assert(paramName.length > 0, "Param name expected.");

    if (params.length >= 1 && optional) {
      const previousParam = params.at(-1)!;
      assert(
        previousParam.optional,
        `The parameter "${previousParam.name}" must be optional due to parameter "${paramName}". Error on ${target.constructor.name}.${methodTarget.name}.`,
      );
    }

    params.push(
      {
        index,
        optional,
        name: paramName,
        dataType: isOptions ? (paramNameOrOptions.dataType ?? paramTypes[index]) : paramTypes[index],
        description: isOptions ? paramNameOrOptions.description : void 0,
        nullable: isOptions ? paramNameOrOptions.nullable : void 0,
      },
    );
  };
}
