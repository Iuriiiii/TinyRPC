import { logIf } from "./log-if.util.ts";

export function logIfNot(expression: unknown, message: string): void {
  return logIf(!expression, message);
}
