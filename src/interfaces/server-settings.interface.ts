import type { Middleware } from "../types/mod.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";

export interface ServerSettings {
  server: Deno.ServeTcpOptions;
  sdk: Partial<SdkOptions>;
  middlewares: Middleware[];
}
