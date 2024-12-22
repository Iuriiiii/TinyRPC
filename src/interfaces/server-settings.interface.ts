import type { Middleware } from "../middlewares/types/mod.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";
import type { ServerOptions } from "./server-options.interface.ts";

/**
 * RPC Server settings.
 */
export interface ServerSettings {
  server: Partial<ServerOptions>;
  sdk: Partial<SdkOptions>;
  middlewares: Middleware[];
}
