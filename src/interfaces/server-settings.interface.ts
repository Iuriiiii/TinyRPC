import { Middleware } from "../types/mod.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";

export interface ServerSettings {
  options: Deno.ServeTcpOptions;
  sdk: Partial<SdkOptions>;
  middlewares: Middleware[];
}
