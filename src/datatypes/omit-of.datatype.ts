import { CustomDatatype } from "../classes/mod.ts";
import type { Datatype } from "../types/mod.ts";

export class OmitDatatype extends CustomDatatype {
  constructor(public readonly dataType: Datatype, public readonly ommitedKeys: string[]) {
    super();
  }
}

export function omitOf(dataType: Datatype, keys: string[]): OmitDatatype {
  return new OmitDatatype(dataType, keys);
}
