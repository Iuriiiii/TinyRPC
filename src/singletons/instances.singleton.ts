import type { ModuleMetadata } from "./interfaces/mod.ts";

/**
 * All class intances.
 */
export const instances = new Map<
  string | ModuleMetadata,
  string | ModuleMetadata
>();
