import { debug } from "./debug.util.ts";

export function debugIf(expression: unknown, message: string): void {
  if (expression) {
    debug(message);
  }
}
