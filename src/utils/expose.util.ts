import type { ExposeParam } from "../decorators/interfaces/mod.ts";
import { isPlainObject } from "@online/is";
import { enums } from "../singletons/mod.ts";

/**
 * Exposes an enum or schema to the client and server.
 *
 * @throws If no enum or schema is provided.
 * @throws If both enum and schema are provided.
 * @throws If the enum has already been exposed.
 * @throws If the enum is not an object.
 *
 * @example
 * export enum MyEnum {
 *   A = "A",
 *   B = "B",
 * }
 *
 * expose({ enum: MyEnum, as: "MyEnum" });
 */
export function expose<T extends object>({ enum: _enum, schema, as: name }: ExposeParam<T>): T {
  const objects = [_enum, schema].filter(Boolean);

  if (objects.length === 0) {
    throw new Error(`Either "enum" or "schema" must be provided.`);
  } else if (objects.length > 1) {
    throw new Error(`Only one of "enum" or "schema" can be provided.`);
  } else if (enums.some((_enum) => _enum.name === name)) {
    throw new Error(`Enum "${name}" already exposed.`);
  } else if (_enum && !isPlainObject(_enum)) {
    throw new Error("Enum must be an enum object.");
  }

  const exposable = objects[0]!;

  Object.defineProperty(exposable, "__TS_ENUM__", { value: name, writable: false, enumerable: false, configurable: true });
  enums.push({ name, value: exposable });

  return exposable;
}
