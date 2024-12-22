import type { RpcRequest, ServerSettings } from "../../interfaces/mod.ts";
import type { StopFunction } from "../../types/mod.ts";

export interface MiddlewareParam {
  request: RpcRequest;
  response: Response;
  stop: StopFunction;
  settings: Partial<ServerSettings>;
}
