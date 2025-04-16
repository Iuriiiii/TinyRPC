import type { DataType } from "../types/mod.ts";

export class PartialDatatype {
  constructor(public readonly dataTypes: DataType[]) { }
}

export function intersectionOf(...dataTypes: DataType[]) {
  return new PartialDatatype(dataTypes);
}