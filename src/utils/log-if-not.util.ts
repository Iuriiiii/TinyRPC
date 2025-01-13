import { logIf } from "./log-if.util.ts";

export function logIfNot(expression: unknown, message: string) {
  return logIf(!expression, message);
}
