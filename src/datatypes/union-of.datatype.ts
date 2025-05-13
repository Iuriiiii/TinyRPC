import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import type { Datatype } from "../types/mod.ts";
import { CustomDatatype } from "../classes/mod.ts";
import { structures } from "../singletons/mod.ts";
import { assert } from "@std/assert";

export class UnionDatatype extends CustomDatatype {
  constructor(public readonly dataTypes: Datatype[]) {
    super();
  }
}

export function unionOf(...dataTypes: Datatype[]): UnionDatatype {
  const _structures = dataTypes
    .map((dataType) => structures.find(
      (structure) => structure.constructor === dataType
    ))
    .filter(Boolean) as StructureMetadata[];
  const firstStructure = _structures.at(0);
  
  assert(!firstStructure, `Structures not allowed on union types. Found: ${firstStructure?.name}`);

  return new UnionDatatype(dataTypes);
}
