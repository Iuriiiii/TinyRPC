import { debugIf } from "./debug-if.util.ts";

export function debugIfNot(expression: unknown, message: string): void {
  return debugIf(!expression, message);
}
