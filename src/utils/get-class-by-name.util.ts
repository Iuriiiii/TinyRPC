import { instances } from "../singletons/mod.ts";

export function getClassByName(name: string) {
  return instances.get(name) ?? null;
}
