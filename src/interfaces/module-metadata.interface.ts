import type { Constructor } from "../types/mod.ts";
import type { MethodMetadata } from "./method-metadata.interface.ts";

export interface ModuleMetadata {
  constructor: Constructor;
  name: string;
  methods: MethodMetadata[];
  moduleName?: string;
}
