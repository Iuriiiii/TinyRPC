import { isPlainObject } from "@online/is";
import type { ExposeParam } from "../interfaces/mod.ts";
import { exposes } from "../singletons/mod.ts";

export function expose<T extends object>({ enum: _enum, schema, as: name }: ExposeParam<T>): T {
  const objects = [_enum, schema].filter(Boolean);

  if (objects.length === 0) {
    throw new Error(`Either "enum" or "schema" must be provided.`);
  } else if (objects.length > 1) {
    throw new Error(`Only one of "enum" or "schema" can be provided.`);
  } else if (exposes.has(name)) {
    throw new Error(`Enum "${name}" already exposed.`);
  } else if (_enum && !isPlainObject(_enum)) {
    throw new Error("Enum must be an enum object.");
  }

  const exposable = objects[0]!;
  exposes.set(name, exposable);
  return exposable;
}
