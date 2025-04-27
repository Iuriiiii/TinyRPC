import { CustomDatatype } from "../classes/mod.ts";
import type { Datatype } from "../types/mod.ts";

export class PartialDatatype extends CustomDatatype {
  constructor(public readonly dataType: Datatype) {
    super();
  }
}

export function partialOf(dataType: Datatype): PartialDatatype {
  return new PartialDatatype(dataType);
}
