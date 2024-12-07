import { structures } from "../singletons/mod.ts";

export function getStructure(name: string) {
  return structures.find((structure) => structure.name === name);
}
