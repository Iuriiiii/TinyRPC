import type { Middleware } from "../types/mod.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";

/**
 * RPC Server settings.
 */
export interface ServerSettings {
  server: Deno.ServeTcpOptions;
  sdk: Partial<SdkOptions>;
  middlewares: Middleware[];
}
