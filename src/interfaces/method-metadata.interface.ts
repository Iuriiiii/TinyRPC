import { ParameterMetadata } from "./parameter-metadata.interface.ts";
import * as Reflect from "deno:reflection";

export interface MethodMetadata {
  method: Reflect.Target;
  name: string;
  parameters: ParameterMetadata[];
  methodName?: string;
}
