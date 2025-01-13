import { warn } from "./warn.util.ts";

export function warnIf(expression: unknown, message: string) {
  if (expression) {
    warn(message);
  }
}
