import * as Reflect from "deno:reflection";
import { methods, params } from "../singletons/mod.ts";

export function Export(methodName?: string) {
  return function (
    target: Reflect.Target,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    // @ts-ignore: Array access.
    const methodTarget = target[propertyKey]

    if (!(methodTarget instanceof Function)) {
      throw new Error(`The "Export" decotarot is for methods only.`);
    }

    const types = (Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    ) as unknown[]) || [];

    if (Object.keys(types).length !== params.length) {
      throw new Error(
        `Undeclared params found on "${propertyKey}". Please add @Param() to all method parameters.`,
      );
    }

    for (let i = 0; i < params.length; i++) {
      const type = types[i];

      // FIXME: Fix serialziable datatypes detection.
      // if (!IsSerializable(type)) {
      //   throw new Error(
      //     `No serializable parameter detected: "${propertyKey}".`
      //   );
      // }

      params[i].type = type;
    }

    methods.push({
      method: target,
      name: descriptor.value.name,
      parameters: [...params],
      methodName,
    });
    params.length = 0;
  };
}
