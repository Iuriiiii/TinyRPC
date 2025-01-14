import type { MiddlewareParam } from "../middlewares/interfaces/mod.ts";
import { AsyncLocalStorage } from "node:async_hooks";
import { settings } from "../singletons/settings.singleton.ts";
import { PrintType } from "../enums/mod.ts";

const asyncLocalStorage = new AsyncLocalStorage();

// deno-lint-ignore no-explicit-any
export function warn(...args: any[]): void {
  const ctx = asyncLocalStorage.getStore() as MiddlewareParam["request"]["rpc"] | undefined;

  settings.events.onPrint?.({
    type: PrintType.Warning,
    args,
    methodName: ctx?.procedure.name,
    moduleName: ctx?.clazz.name,
    logger: console.warn,
  });
}
