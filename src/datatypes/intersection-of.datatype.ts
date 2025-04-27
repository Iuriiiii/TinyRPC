import { CustomDatatype } from "../classes/mod.ts";
import type { Datatype } from "../types/mod.ts";

export class IntersectionDatatype extends CustomDatatype {
  constructor(public readonly dataTypes: Datatype[]) {
    super();
  }
}

export function intersectionOf(...dataTypes: Datatype[]): IntersectionDatatype {
  return new IntersectionDatatype(dataTypes);
}
