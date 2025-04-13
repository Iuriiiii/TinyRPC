import { warnIf } from "./warn-if.util.ts";

/**
 * Log a warning message if the given expression is falsy.
 *
 * @param expression - A value to check for falsiness.
 * @param message - The message to log if the expression is falsy.
 */
export function warnIfNot(expression: unknown, message: string): void {
  return warnIf(!expression, message);
}
