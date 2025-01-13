import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { AsyncLocalStorage } from "node:async_hooks";
import { settings } from "../singletons/settings.singleton.ts";
import { PrintType } from "../enums/mod.ts";

const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Debug information, just for server side.
 */
// deno-lint-ignore no-explicit-any
export function debug(...args: any[]) {
  const ctx = asyncLocalStorage.getStore() as MiddlewareParam["request"]["rpc"] | undefined;

  settings.events.onPrint?.({
    type: PrintType.Debug,
    args,
    methodName: ctx?.procedure.name,
    moduleName: ctx?.clazz.name,
    logger: console.debug,
  });
}
