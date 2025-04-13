import { info } from "./info.util.ts";

/**
 * Log an information message if the given expression is truthy.
 *
 * @param expression - A value to check for truthiness.
 * @param message - The message to log if the expression is truthy.
 */
export function infoIf(expression: unknown, message: string): void {
  if (expression) {
    info(message);
  }
}
