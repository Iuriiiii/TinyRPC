import type { Constructor, PickMembers } from "../types/mod.ts";
import type { ExportDecoratorOptions } from "./interfaces/mod.ts";
import { Reflect } from "@dx/reflect";
import { methods, params } from "../singletons/mod.ts";
import { assert } from "@std/assert";
import { isUndefined } from "@online/is";
import { Stream } from "../classes/mod.ts";

function isExportDecoratorOptions<T extends object>(
  param?: string | Partial<ExportDecoratorOptions<T>>,
): param is Partial<ExportDecoratorOptions<T>> {
  return typeof param === "object";
}

/**
 * Makes a method available for remote calls.
 * @param {string | Partial<ExportDecoratorOptions>} param Name or options of the method.
 */
export function Export<
  // deno-lint-ignore ban-types
  T extends object = {},
  K extends object = PickMembers<T>,
>(param?: string | Partial<ExportDecoratorOptions<K>>): MethodDecorator {
  return function (
    // deno-lint-ignore no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    assert(
      !isUndefined(target),
      `
The "Export" decorator can't read the class information.
Did you enable decorators on your project?
    `.trim(),
    );

    const isOptions = isExportDecoratorOptions<K>(param);
    const methodName = (isOptions ? param.name : param) || descriptor.value.name;
    // @ts-ignore: index access
    const methodTarget = target[propertyKey];

    assert(methodTarget instanceof Function, `The "Export" decorator is for methods only.`);
    assert(typeof propertyKey !== "symbol", `The "Export" decorator does not works with symbols.`);

    const isSomeStreamParam = params.some((param) => param.dataType === Stream);

    if (isSomeStreamParam) {
      assert(
        params.length === 1,
        `Exports with streams can only have one param, error on ${target.constructor.name}.${methodTarget.name}.`,
      );
    }

    const returnType = (() => {
      if (isOptions && param.returnType) {
        return param.returnType;
      }

      return Reflect.getMetadata("design:returntype", target, propertyKey) as Constructor | undefined;
    })();

    assert(
      returnType !== Promise,
      `For promise responses the "returnType" option is required and needs to be different to a promise. Error on ${target.constructor.name}.${methodTarget.name}.`,
    );
    assert(
      !isUndefined(returnType),
      `
The "Export" decorator requires an explicit return type on ${target.constructor.name}.${methodTarget.name}.
Only native datatypes and serializable classes are supported.
      `.trim(),
    );
    assert(!methods.some((method) => method.name === methodName), `The method "${methodName}" is already exported.`);

    methods.push({
      name: methodName,
      params: [...params],
      returnType,
      generics: isOptions ? param.generics : void 0,
      // @ts-ignore: Irrelevant type error
      links: isOptions ? param.links : void 0,
      description: isOptions ? param.description : void 0,
    });
    params.length = 0;
  };
}
