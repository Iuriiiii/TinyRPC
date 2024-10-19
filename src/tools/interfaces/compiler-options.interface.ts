import type { SdkOptions } from "../../interfaces/mod.ts";

export interface ICompilerOptions {
  sdk?: Partial<SdkOptions>;
  host?: string;
}
