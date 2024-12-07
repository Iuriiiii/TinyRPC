import type { Constructor } from "../types/mod.ts";

const EXTENSION_READER_PATTERN = /extends\s*([\w-_]+)\s*\{/;

export function getClassExtension(clazz: Constructor) {
  return clazz.toString().match(EXTENSION_READER_PATTERN)?.[1];
}
