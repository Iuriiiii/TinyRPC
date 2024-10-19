import * as Reflect from "deno:reflection";
import { methods, params } from "../singletons/mod.ts";

/**
 * Makes a method available for remote calls.
 * @param methodName {string} The name of the method.
 */
export function Export(methodName?: string) {
  return function (
    /**
     * The class decored.
     */
    target: Reflect.Target,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    // @ts-ignore: Array access.
    const methodTarget = target[propertyKey];

    if (!(methodTarget instanceof Function)) {
      throw new Error(`The "Export" decorator is for methods only.`);
    } else if (typeof propertyKey === "symbol") {
      throw new Error(`The "Export" decorator does not works with symbols.`);
    }

    methods.push({
      name: descriptor.value.name,
      methodName,
      params: [...params],
    });
    params.length = 0;
  };
}
