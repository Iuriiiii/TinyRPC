import { ParameterMetadata } from "./parameter-metadata.interface.ts";

export interface MethodMetadata {
  name: string;
  methodName?: string;
  params: ParameterMetadata[];
}
