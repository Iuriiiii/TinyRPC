import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { AsyncLocalStorage } from "node:async_hooks";
import { settings } from "../singletons/settings.singleton.ts";
import { PrintType } from "../enums/mod.ts";

const asyncLocalStorage = new AsyncLocalStorage();

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
    moduleName: ctx?.clazz.name,
    logger: console.info,
  });
}
