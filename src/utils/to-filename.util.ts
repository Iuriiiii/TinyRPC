import { kebabCase } from "jsr:case";

export function toFilename(name: string, postfix: string) {
  return `${kebabCase(name).toLowerCase()}.${postfix}.ts`;
}
