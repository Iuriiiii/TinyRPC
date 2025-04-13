import type { RpcRequest, ServerSettings } from "../../interfaces/mod.ts";
import type { StopFunction } from "../../types/mod.ts";
import type { IHandlerOptions } from "@online/serve";

export interface MiddlewareParam extends Pick<IHandlerOptions, "upgradeToWebSocket"> {
  /**
   * The request.
   */
  request: RpcRequest;

  /**
   * The response.
   */
  response: Response;

  /**
   * The stop function.
   * Call it if you want to stop the middleware chain.
   * It means that your middleware will be the last middleware executed.
   */
  stop: StopFunction;

  /**
   * The server settings.
   */
  settings: Partial<ServerSettings>;
}
