import { params } from "../singletons/mod.ts";
import * as Reflect from "deno:reflection";

export function Param(paramName?: string) {
  return function (
    /**
     * The class decored.
     */
    target: Reflect.Target,
    /**
     * The current method.
     */
    propertyKey: string | symbol,
    /**
     * The param index.
     */
    index: number,
  ) {
    if (paramName !== undefined && paramName.length === 0) {
      throw new Error("Param name expected.");
    }

    const constructorName = target.constructor.name;
    const single = paramName !== undefined && paramName.length > 0;
    Reflect.defineMetadata(
      `trpc:${constructorName}:${String(propertyKey)}:${index}:single`,
      single,
      target,
    );

    if (paramName) {
      Reflect.defineMetadata(
        `trpc:${constructorName}:${String(propertyKey)}:${index}:name`,
        paramName,
        target,
      );
    }

    const paramtypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey,
    );
    Reflect.defineMetadata(
      `trpc:${constructorName}:${String(propertyKey)}:${index}:type`,
      // @ts-ignore: Array access.
      paramtypes[index],
      target,
    );
    
    params.push({
      name: propertyKey,
      param: target,
      index,
      single,
      paramName,
      type: null,
    });
  };
}
