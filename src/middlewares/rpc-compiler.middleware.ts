import type { NextMiddleware } from "../mod.ts";

export function rpcCompiler(
  _request: Request,
  _response: Response,
  next: NextMiddleware,
) {
  return next();
}
