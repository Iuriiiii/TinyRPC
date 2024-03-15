import { instances } from "../singletons/mod.ts";

export function getClassByName(name: string) {
  return instances.find((clazz) => clazz.name === name)?.instance ?? null;
}
