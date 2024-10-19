import { NextMiddleware } from "../mod.ts";

export function rpcCompiler(
  request: Request,
  response: Response,
  next: NextMiddleware,
) {
  return next();
}
