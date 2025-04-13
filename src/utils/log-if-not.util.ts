import { logIf } from "./log-if.util.ts";

/**
 * Log a message if the given expression is falsy.
 *
 * @param expression - A value to check for falsiness.
 * @param message - The message to log if the expression is falsy.
 */
export function logIfNot(expression: unknown, message: string): void {
  return logIf(!expression, message);
}
