import type { MapStructure } from "../types/mod.ts";
import type { ExportDecoratorOptions } from "./export-decorator-options.interface.ts";
import type { ParameterMetadata } from "./parameter-metadata.interface.ts";

export interface MethodMetadata extends Partial<ExportDecoratorOptions> {
  name: string;
  params: ParameterMetadata[];
}
