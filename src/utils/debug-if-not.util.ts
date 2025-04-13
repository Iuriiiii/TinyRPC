import { debugIf } from "./debug-if.util.ts";

/**
 * Log a debug message if the given expression is falsy.
 *
 * @param expression - A value to check for falsiness.
 * @param message - The message to log if the expression is falsy.
 */
export function debugIfNot(expression: unknown, message: string): void {
  return debugIf(!expression, message);
}
