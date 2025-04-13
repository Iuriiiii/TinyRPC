import type { Constructor } from "../types/mod.ts";

const EXTENSION_READER_PATTERN = /extends\s*([\w-_]+)\s*\{/;

/**
 * Given a class, return the name of the class that it extends.
 *
 * If the class does not extend any other class, return the class name itself.
 *
 * @param clazz - The class to get the extension for.
 * @returns The name of the class that `clazz` extends.
 */
export function getClassExtension(clazz: Constructor) {
  return clazz.toString().match(EXTENSION_READER_PATTERN)?.[1] ?? Object.getPrototypeOf(clazz).name;
}
