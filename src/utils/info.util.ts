import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { PrintType } from "../enums/mod.ts";
import { asyncLocalStorage, settings } from "../singletons/mod.ts";

/**
 * Prints information, just for server side.
 */
// deno-lint-ignore no-explicit-any
export function info(...args: any[]): void {
  const ctx = asyncLocalStorage.getStore() as MiddlewareParam["request"]["rpc"] | undefined;

  settings.events.onPrint?.({
    type: PrintType.Information,
    args,
    methodName: ctx?.procedure.name,
    moduleName: ctx?.instance.name,
    logger: console.info,
  });
}
