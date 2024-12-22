import type { StopFunction } from "../../types/mod.ts";
import type { ServerSettings } from "../../interfaces/server-settings.interface.ts";
import type { RpcRequest } from "../../interfaces/rpc-request.interface.ts";

export interface MiddlewareParam {
  request: RpcRequest;
  response: Response;
  stop: StopFunction;
  settings: Partial<ServerSettings>;
}
