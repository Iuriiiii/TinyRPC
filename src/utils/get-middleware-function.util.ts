import type { Middleware } from "../middlewares/types/mod.ts";

/**
 * Returns the actual middleware function from the given middleware.
 * If the middleware is an object, it assumes that the object has a "middleware" property with the actual middleware function.
 *
 * @param middleware - The middleware to get the function from.
 * @returns The actual middleware function.
 */
export function getMiddlewareFunction(middleware: Middleware) {
  return middleware instanceof Object && "middleware" in middleware ? middleware.middleware : middleware;
}
