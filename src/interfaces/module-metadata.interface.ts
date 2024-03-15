import { Constructor } from "../types/mod.ts";
import { MethodMetadata } from "./method-metadata.interface.ts";

export interface ModuleMetadata {
  constructor: Constructor;
  name: string;
  methods: MethodMetadata[];
  moduleName?: string;
}
