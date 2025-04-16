import type { ParamDecoratorOptions } from "../../decorators/interfaces/mod.ts";
import type { Datatype } from "../../types/mod.ts";

export interface ParameterMetadata extends Partial<ParamDecoratorOptions> {
  /**
   * Param index.
   */
  index: number;
  /**
   * Param datatype.
   */
  dataType: Datatype;
}
