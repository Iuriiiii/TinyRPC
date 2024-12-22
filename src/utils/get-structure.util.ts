import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { structures } from "../singletons/mod.ts";

export function getStructure(name: string): StructureMetadata | undefined {
  return structures.find((structure) => structure.name === name);
}
