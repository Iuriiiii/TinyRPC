import type { StopFunction } from "../mod.ts";

export function rpcCompiler(
  _request: Request,
  _response: Response,
  next: StopFunction,
) {
  return next();
}
