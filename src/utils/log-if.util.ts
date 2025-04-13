import { log } from "./log.util.ts";

/**
 * Log a message if the given expression is truthy.
 *
 * @param expression - A value to check for truthiness.
 * @param message - The message to log if the expression is truthy.
 */
export function logIf(expression: unknown, message: string): void {
  if (expression) {
    log(message);
  }
}
