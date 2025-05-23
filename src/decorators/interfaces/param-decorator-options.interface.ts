import type { Datatype } from "../../types/mod.ts";

export interface ParamDecoratorOptions {
  /**
   * Name of the param to be used on the SDK.
   */
  name: string;

  /**
   * Whether the param is optional or not.
   */
  optional: boolean;

  /**
   * Data type of the param.
   * If string, it will be hardcoded to the param type.
   */
  dataType: Datatype;

  /**
   * Whether the param is nullable or not.
   */
  nullable: boolean;

  /**
   * Description of the param.
   */
  description: string;
}
