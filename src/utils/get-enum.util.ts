import { enums } from "../singletons/mod.ts";

/**
 * Retrieves an enumerator's value from the global `enums` collection by its name.
 *
 * @param name - The name of the enumerator to find.
 * @returns The value of the enumerator if found, otherwise `undefined`.
 *
 * @typeParam T - The expected type of the enumerator's value.
 */

export function getEnum<T extends object | undefined>(name: string): T {
  return enums.find((_enum) => _enum.name === name)?.value as T;
}
