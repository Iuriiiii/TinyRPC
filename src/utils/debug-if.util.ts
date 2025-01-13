import { debug } from "./debug.util.ts";

export function debugIf(expression: unknown, message: string) {
  if (expression) {
    debug(message);
  }
}
