import * as Reflect from "deno:reflection";
import { ParamDecoratorOptions, ParameterMetadata, params } from "../mod.ts";

function isParamString(item: unknown): item is string {
  return typeof item === "string";
}

function isParamOptions(item: unknown): item is ParamDecoratorOptions {
  return item instanceof Object && ("paramName" in item || "interface" in item);
}

export function Param(paramNameOrOptions?: string | ParamDecoratorOptions) {
  return function (
    /**
     * The class decored.
     */
    target: Reflect.Target,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    /** q
     * The param index.
     */
    index: number,
  ) {
    let paramName: string | undefined;
    let interfaceName: string | undefined;

    if (paramNameOrOptions !== undefined) {
      if (isParamString(paramNameOrOptions)) {
        if (paramNameOrOptions.length === 0) {
          throw new Error("Param name expected.");
        }

        paramName = paramNameOrOptions;
      } else if (isParamOptions(paramNameOrOptions)) {
        if (
          paramNameOrOptions.paramName !== undefined
        ) {
          if (paramNameOrOptions.paramName.length === 0) {
            throw new Error("Param name can't be empty.");
          }

          paramName = paramNameOrOptions.paramName;
        }

        interfaceName = paramNameOrOptions.interface;
      } else {
        throw new Error("Invalid arguments.");
      }
    }

    const single = paramName !== undefined && paramName.length > 0;
    const paramtypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    );

    params.push(
      {
        // @ts-ignore: Array access.
        type: paramtypes[index],
        index,
        single,
        paramName,
        interfaceName,
      } satisfies ParameterMetadata,
    );
  };
}
