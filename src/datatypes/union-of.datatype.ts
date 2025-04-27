import { CustomDatatype } from "../classes/mod.ts";
import type { Datatype } from "../types/mod.ts";

export class UnionDatatype extends CustomDatatype {
  constructor(public readonly dataTypes: Datatype[]) {
    super();
  }
}

export function unionOf(...dataTypes: Datatype[]): UnionDatatype {
  return new UnionDatatype(dataTypes);
}
