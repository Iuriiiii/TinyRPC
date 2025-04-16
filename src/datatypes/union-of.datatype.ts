import type { DataType } from "../types/mod.ts";

export class UnionDatatype {
  constructor(public readonly dataTypes: DataType[]) {}
}

export function unionOf(...dataTypes: DataType[]) {
  return new UnionDatatype(dataTypes);
}
