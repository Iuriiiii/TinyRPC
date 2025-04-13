import { warn } from "./warn.util.ts";

/**
 * Log a warning message if the given expression is truthy.
 *
 * @param expression - A value to check for truthiness.
 * @param message - The message to log if the expression is truthy.
 */
export function warnIf(expression: unknown, message: string): void {
  if (expression) {
    warn(message);
  }
}
