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
}
