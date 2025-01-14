import { warnIf } from "./warn-if.util.ts";

export function warnIfNot(expression: unknown, message: string): void {
  return warnIf(!expression, message);
}
