import type { Constructor } from "../types/constructor.type.ts";

export interface ExportDecoratorOptions {
  /**
   * The name to use in the SDK.
   */
  name: string;
  /**
   * The return type to use in the SDK.
   * If this member is an string, the return type is hardcoded.
   */
  returnType: Constructor | string;
  /**
   * The generics that this method has.
   * It will be included in the SDK.
   */
  generics: string[];
}
