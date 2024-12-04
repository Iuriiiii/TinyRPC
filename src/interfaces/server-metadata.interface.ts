import type { EnumMetadata } from "./enum-metadata.interface.ts";
import type { ModuleMetadata } from "./module-metadata.interface.ts";
import type { StructureMetadata } from "./structure-metadata.interface.ts";

export interface ServerMetadata {
  instances: Map<string | ModuleMetadata, string | ModuleMetadata>;
  modules: ModuleMetadata[];
  structures: StructureMetadata[];
  enums: EnumMetadata[];
}
