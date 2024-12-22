import type { Middleware } from "../middlewares/types/mod.ts";

export function getMiddlewareFunction(middleware: Middleware) {
  return middleware instanceof Object && "middleware" in middleware ? middleware.middleware : middleware;
}
