import { debug } from "./debug.util.ts";

/**
 * Log a debug message if the given expression is truthy.
 *
 * @param expression - A value to check for truthiness.
 * @param message - The message to log if the expression is truthy.
 */
export function debugIf(expression: unknown, message: string): void {
  if (expression) {
    debug(message);
  }
}
