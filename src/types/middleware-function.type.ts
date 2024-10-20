import type { NextMiddleware } from "./next-middleware.type.ts";
import type { TypeAndPromise } from "./type-and-promise.type.ts";

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextMiddleware,
) => TypeAndPromise<Response | void>;
