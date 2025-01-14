import { warn } from "./warn.util.ts";

export function warnIf(expression: unknown, message: string): void {
  if (expression) {
    warn(message);
  }
}
