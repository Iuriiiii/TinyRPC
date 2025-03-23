import type { CompilerInformation } from "./compiler-information.interface.ts";

/**
 * General SDK generation options.
 */
export interface SdkOptions {
  /**
   * The path to the package.json file.
   */
  path: string;

  /**
   * Sdk name.
   */
  name: string;

  /**
   * Sdk version.
   */
  version: string;

  /**
   * True to not generate the sdk.
   */
  doNotGenerate: boolean;

  /**
   * Compilers to use on this project.
   */
  compilers: CompilerInformation<unknown>[];
}
