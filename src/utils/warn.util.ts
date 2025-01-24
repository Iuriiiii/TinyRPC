import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { asyncLocalStorage, settings } from "../singletons/mod.ts";
import { PrintType } from "../enums/mod.ts";

/**
 * Write warnings
 */
// deno-lint-ignore no-explicit-any
export function warn(...args: any[]): void {
  const ctx = asyncLocalStorage.getStore() as MiddlewareParam["request"]["rpc"] | undefined;

  settings.events.onPrint?.({
    type: PrintType.Warning,
    args,
    methodName: ctx?.procedure.name,
    moduleName: ctx?.instance.name,
    logger: console.warn,
  });
}
