import type { DataType } from "../types/mod.ts";

export class OmitDatatype {
  constructor(public readonly dataType: DataType, private readonly ommitedKeys: string[]) { }
}

export function intersectionOf(dataType: DataType, keys: string[]) {
  return new OmitDatatype(dataType, keys);
}