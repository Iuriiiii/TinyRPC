import type { ExportDecoratorOptions } from "../../decorators/interfaces/mod.ts";
import type { ParameterMetadata } from "./parameter-metadata.interface.ts";

export interface MethodMetadata extends Partial<ExportDecoratorOptions> {
  name: string;
  params: ParameterMetadata[];
}
