import { MiddlewareFunction } from "./middleware-function.type.ts";
import { MiddlewareObject } from "../interfaces/middleware-object.interface.ts";

export type Middleware = MiddlewareFunction | MiddlewareObject;
