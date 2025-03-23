import type { RpcRequest, ServerSettings } from "../../interfaces/mod.ts";
import type { StopFunction } from "../../types/mod.ts";
import type { IHandlerOptions } from "@online/serve";

export interface MiddlewareParam extends Pick<IHandlerOptions, "upgradeToWebSocket"> {
  request: RpcRequest;
  response: Response;
  stop: StopFunction;
  settings: Partial<ServerSettings>;
}
