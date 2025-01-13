import { debugIf } from "./debug-if.util.ts";

export function debugIfNot(expression: unknown, message: string) {
  return debugIf(!expression, message);
}
