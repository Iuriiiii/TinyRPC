import type { RequireAtLeastOne, SerializedClass } from "@online/packager";
import type { Constructor } from "../types/mod.ts";

export function getModuleDeserializer<T extends Constructor>(
  clazz: T,
  serialized: RequireAtLeastOne<SerializedClass<T>>,
) {
  const { arguments: _arguments = [], members = {} } = serialized;
  const instance = new clazz(..._arguments);

  return Object.assign(instance, members);
}
