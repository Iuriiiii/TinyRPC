import { warnIf } from "./warn-if.util.ts";

export function warnIfNot(expression: unknown, message: string) {
  return warnIf(!expression, message);
}
