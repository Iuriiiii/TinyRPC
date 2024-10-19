import * as Reflect from "deno:reflection";

/**
 * Declares a class as an interface to be used within a controller.
 * @param interfaceName
 */
export function Interface(interfaceName: string) {
  return function (
    target: Reflect.Target,
    propertyKey: string | symbol,
    index: number,
  ) {
    if (interfaceName.length === 0) {
      throw new Error("Interface name expected.");
    }

    const constructorName = target.constructor.name;
    Reflect.defineMetadata(
      `trpc:${constructorName}:${String(propertyKey)}:${index}:interfaceName`,
      interfaceName,
      target,
    );
  };
}
