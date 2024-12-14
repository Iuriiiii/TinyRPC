import { enums } from "../singletons/mod.ts";

export function getEnum<T extends object | undefined>(name: string): T {
  return enums.find((_enum) => _enum.name === name)?.value as T;
}
