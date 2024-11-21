import type { SdkOptions } from "./sdk-options.interface.ts";
import type { ServerMetadata } from "./server-metadata.interface.ts";

export interface CompilerOptions {
  metadata: ServerMetadata;
  sdkOptions?: Partial<SdkOptions>;
}
