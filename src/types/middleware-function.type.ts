import { NextMiddleware } from "./mod.ts";

export type MiddlewareFunction = (
  request: Request,
  response: Response,
  next: NextMiddleware
) => Response | void | Promise<Response | void>;
