import type { DataType } from "../types/mod.ts";

export class IntersectionDatatype {
  constructor(public readonly dataTypes: DataType[]) {}
}

export function intersectionOf(...dataTypes: DataType[]) {
  return new IntersectionDatatype(dataTypes);
}
