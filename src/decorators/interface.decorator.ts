import * as Reflect from "deno:reflection";

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
