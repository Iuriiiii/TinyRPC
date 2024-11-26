import type { DataType } from "../types/mod.ts";
import type { ParamDecoratorOptions } from "./param-decorator-options.interface.ts";

export interface ParameterMetadata extends Partial<ParamDecoratorOptions> {
  /**
   * Param index.
   */
  index: number;
  /**
   * Param datatype.
   */
  dataType: DataType;
}
