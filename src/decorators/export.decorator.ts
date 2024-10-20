import { Reflect } from "jsr:reflection";
import { methods, params } from "../singletons/mod.ts";
import type { Constructor } from "../types/mod.ts";
import type { ExportDecoratorOptions } from "../interfaces/mod.ts";

function isExportDecoratorOptions(
  param?: string | Partial<ExportDecoratorOptions>,
): param is Partial<ExportDecoratorOptions> {
  return typeof param === "object";
}

/**
 * Makes a method available for remote calls.
 * @param param {string} The name of the method.
 */
export function Export(
  param?: string | Partial<ExportDecoratorOptions>,
): unknown {
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
    descriptor: PropertyDescriptor,
  ) {
    const isOptions = isExportDecoratorOptions(param);
    const methodName = isOptions ? param.name : param;
    // @ts-ignore: Array access.
    const methodTarget = target[propertyKey];

    if (!(methodTarget instanceof Function)) {
      throw new Error(`The "Export" decorator is for methods only.`);
    } else if (typeof propertyKey === "symbol") {
      throw new Error(`The "Export" decorator does not works with symbols.`);
    }

    const returnType = (() => {
      if (isOptions && param.returnType) {
        return param.returnType;
      }

      return Reflect.getMetadata(
        "design:returntype",
        target,
        propertyKey,
      ) as Constructor | undefined;
    })();

    if (returnType === undefined) {
      throw new Error(
        `
The "Export" decorator requires an explicit return type: ${target.constructor.name}.${methodTarget.name}.
Only native datatypes and serializable classes are supported.
        `.trim(),
      );
    }

    methods.push({
      name: methodName ?? descriptor.value.name,
      params: [...params],
      returnType,
      generics: isOptions ? param.generics : void 0,
    });
    params.length = 0;
  };
}
