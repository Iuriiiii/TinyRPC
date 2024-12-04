import type { ModuleMetadata } from "./module-metadata.interface.ts";
import type { StructureMetadata } from "./structure-metadata.interface.ts";

export interface ServerMetadata {
  instances: Map<string | ModuleMetadata, string | ModuleMetadata>;
  modules: ModuleMetadata[];
  structures: StructureMetadata[];
  exposes: Map<string | object, string | object>;
}
