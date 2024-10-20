import type { MiddlewareFunction } from "./middleware-function.type.ts";
import type { MiddlewareObject } from "../interfaces/middleware-object.interface.ts";

export type Middleware = MiddlewareFunction | MiddlewareObject;
