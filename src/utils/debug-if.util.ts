import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { PrintType } from "../enums/mod.ts";
import { asyncLocalStorage, settings } from "../singletons/mod.ts";

/**
 * Log a debug message if the given expression is truthy.
 *
 * @param expression - A value to check for truthiness.
 * @param message - The message to log if the expression is truthy.
 */
// deno-lint-ignore no-explicit-any
export function debugIf(expression: unknown, ...args: any[]): void {
  if (expression) {
    const ctx = asyncLocalStorage.getStore() as MiddlewareParam["request"]["rpc"] | undefined;

    settings.events.onPrint?.({
      type: PrintType.Debug,
      args,
      methodName: ctx?.procedure.name,
      moduleName: ctx?.instance.name,
      logger: console.debug,
    });
  }
}
