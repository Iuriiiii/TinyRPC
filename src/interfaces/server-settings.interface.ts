import type { Middleware } from "../middlewares/types/mod.ts";
import type { EventSettings } from "./event-settings.interface.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";
import type { ServerOptions } from "./server-options.interface.ts";
import type { IWebSocketHandlerOptions } from "@online/serve";

/**
 * RPC Server settings.
 */
export interface ServerSettings {
  server: Partial<ServerOptions>;
  sdk: Partial<SdkOptions>;
  middlewares: Middleware[];
  events: Partial<EventSettings>;
  websockHandler(options: IWebSocketHandlerOptions): void;
}
