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

    Reflect.defineMetadata(
      `trpc:${String(propertyKey)}:${index}`,
      interfaceName,
      target,
    );
  };
}
