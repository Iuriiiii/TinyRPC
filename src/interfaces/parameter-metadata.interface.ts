import type { ParamDecoratorOptions } from "./param-decorator-options.interface.ts";

export interface ParameterMetadata extends Partial<ParamDecoratorOptions> {
  index: number;
  single: boolean;
  type: unknown;
}
