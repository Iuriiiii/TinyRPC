import type { Falsy } from "../types/mod.ts";

export function isFalsy(expression: unknown): expression is Falsy {
  return !expression;
}
