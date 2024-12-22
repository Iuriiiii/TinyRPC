import type { MiddlewareFunction } from "./middleware-function.type.ts";
import type { MiddlewareObject } from "../middlewares/interfaces/middleware-object.interface.ts";

export type Middleware = MiddlewareFunction | MiddlewareObject;
