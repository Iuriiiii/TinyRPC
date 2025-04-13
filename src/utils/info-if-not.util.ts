import { infoIf } from "./info-if.util.ts";

/**
 * Log an information message if the given expression is falsy.
 *
 * @param expression - A value to check for falsiness.
 * @param message - The message to log if the expression is falsy.
 */
export function infoIfNot(expression: unknown, message: string): void {
  return infoIf(!expression, message);
}
