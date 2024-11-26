import { Reflect } from "@dx/reflect";

/**
 * Declares a class as an interface to be used within a controller.
 * @param interfaceName
 */
export function Interface(interfaceName: string) {
  return function (
    // deno-lint-ignore no-explicit-any
    target: any,
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
