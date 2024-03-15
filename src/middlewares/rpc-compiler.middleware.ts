import { NotFoundException } from "../exceptions/not-found.exception.ts";
import { Middleware, NextMiddleware } from "../mod.ts";

export function rpcCompiler(
  request: Request,
  response: Response,
  next: NextMiddleware
) {
  

  return next();
}
