import type { Datatype, MapStructure } from "../../types/mod.ts";

export interface ExportDecoratorOptions<T extends object = object> {
  /**
   * The name to use in the SDK.
   */
  name: string;
  /**
   * The return type to use in the SDK.
   * If this member is an string, the return type is hardcoded.
   */
  returnType: Datatype;
  /**
   * The generics that this method has.
   * It will be included in the SDK.
   */
  generics: string[];
  /**
   * The members to read from the client.
   */
  links: MapStructure<T>;
}
