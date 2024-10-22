import { structures } from "../singletons/mod.ts";

export function getStructure(datatypeName: string) {
  return structures.find((datatype) => datatype.name === datatypeName);
}
