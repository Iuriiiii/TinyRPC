import { Middleware } from "../mod.ts";

export function getMiddlewareFunction(middleware: Middleware) {
  return middleware instanceof Object && "middleware" in middleware
    ? middleware.middleware
    : middleware;
}
