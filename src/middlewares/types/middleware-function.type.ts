import type { TypeAndPromise } from "../../types/mod.ts";
import type { MiddlewareParam } from "../interfaces/mod.ts";

/**
 * Middleware function.
 */
export type MiddlewareFunction = (param: MiddlewareParam) => TypeAndPromise<Response | void>;
