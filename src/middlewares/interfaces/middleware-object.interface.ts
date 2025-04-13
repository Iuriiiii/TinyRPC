import type { MiddlewareFunction } from "../types/mod.ts";

/**
 * Middleware object.
 */
export interface MiddlewareObject {
  middleware: MiddlewareFunction;
}
