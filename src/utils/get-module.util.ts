import { modules } from "../singletons/mod.ts";

export function getModule(name: string) {
  return modules.find((module) => module.name === name);
}
