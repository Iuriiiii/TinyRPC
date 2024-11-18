import type { StopFunction } from "../types/mod.ts";
import type { ServerSettings } from "./server-settings.interface.ts";

export interface MiddlewareParam {
  request: Request;
  response: Response;
  stop: StopFunction;
  settings: Partial<ServerSettings>;
}
