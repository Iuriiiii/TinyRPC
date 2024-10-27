import { Reflect } from "jsr:reflection";
import { methods, params } from "../singletons/mod.ts";
import type { Constructor, PickMembers } from "../types/mod.ts";
import type { ExportDecoratorOptions } from "../interfaces/mod.ts";
import { assert } from "jsr:assert";

function isExportDecoratorOptions<T extends object>(
  param?: string | Partial<ExportDecoratorOptions<T>>,
): param is Partial<ExportDecoratorOptions<T>> {
  return typeof param === "object";
}

/**
 * Makes a method available for remote calls.
 * @param {string | Partial<ExportDecoratorOptions>} param Name or options of the method.
 */
export function Export<T extends object, K extends object = PickMembers<T>>(
  param?: string | Partial<ExportDecoratorOptions<K>>,
  // deno-lint-ignore no-explicit-any
): any {
  console.log('src/decorators/export.decorator.ts:21->Export');
  return function (
    /**
     * The class decored.
     */
    target: Constructor,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
  console.log('src/decorators/export.decorator.ts:21->$Export');
    const isOptions = isExportDecoratorOptions<K>(param);
    const methodName = isOptions ? param.name : param;
    // @ts-ignore: Array access.
    const methodTarget = target[propertyKey];

    assert(
      methodTarget instanceof Function,
      `The "Export" decorator is for methods only.`,
    );
    assert(
      typeof propertyKey !== "symbol",
      `The "Export" decorator does not works with symbols.`,
    );

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

    assert(
      returnType !== undefined,
      `
The "Export" decorator requires an explicit return type: ${target.constructor.name}.${methodTarget.name}.
Only native datatypes and serializable classes are supported.
      `.trim(),
    );

    methods.push({
      name: methodName ?? descriptor.value.name,
      params: [...params],
      returnType,
      generics: isOptions ? param.generics : void 0,
    });
    params.length = 0;
  };
}
