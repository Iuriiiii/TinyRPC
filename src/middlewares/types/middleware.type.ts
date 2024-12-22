import type { MiddlewareObject } from "../interfaces/mod.ts";
import type { MiddlewareFunction } from "./middleware-function.type.ts";

export type Middleware = MiddlewareFunction | MiddlewareObject;
