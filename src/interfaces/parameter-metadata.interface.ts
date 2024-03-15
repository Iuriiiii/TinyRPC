export interface ParameterMetadata {
  name: string | symbol;
  param: unknown;
  index: number;
  single: boolean;
  paramName?: string;
  type: unknown;
}
