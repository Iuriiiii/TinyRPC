import type { ServerMetadata } from "../singletons/interfaces/mod.ts";
import type { SdkOptions } from "./sdk-options.interface.ts";
import type { ServerOptions } from "./server-options.interface.ts";

export interface CompilerOptions {
  metadata: ServerMetadata;
  sdkOptions?: Partial<SdkOptions>;
  server?: Partial<ServerOptions>;
}
