import type { Constructor, Datatype } from "../types/mod.ts";
import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { assert } from "@std/assert";
import { CustomDatatype } from "../classes/mod.ts";
import { calculateDatatype, DatatypeType, getClassName, getStructure, randomString } from "../utils/mod.ts";
import { intersectionType } from "./utils/mod.ts";
import { structures } from "../singletons/mod.ts";

const VALID_TYPES = [DatatypeType.Structure, DatatypeType.Module, DatatypeType.Custom];

export class IntersectionDatatype extends CustomDatatype {
  constructor(public readonly dataTypes: Datatype[]) {
    super();
  }
}

function searchForPreviousIntersection(...dataTypes: Datatype[]) {
  let result: StructureMetadata | undefined;

  for (const structure of structures) {
    const hasIntersectionMetadata = structure.metadata.intersectionOf as Datatype[] | undefined;

    if (!hasIntersectionMetadata) {
      continue;
    }

    if (hasIntersectionMetadata.every((type) => dataTypes.includes(type))) {
      result = structure;
      break;
    }
  }

  return result;
}

export function intersectionOf(...dataTypes: Datatype[]): Constructor {
  const calculatedDatatypes = dataTypes.map(calculateDatatype);

  assert(
    calculatedDatatypes.every((calculatedDatatype) => VALID_TYPES.includes(calculatedDatatype.type)),
    "All datatypes must be structures, modules or custom datatypes.",
  );

  return searchForPreviousIntersection(...dataTypes)?.constructor || (() => {
    const classes = calculatedDatatypes.map((calculatedDatatype) => calculatedDatatype.reference as Constructor);

    class CustomIntersectionDatatype extends intersectionType(...classes) {}

    // Expose
    const _structures = classes.map((type) => getStructure(getClassName(type)));
    const typesName = classes.map((type) => getClassName(type)).join("_");
    const structureName = `IntersectionOf${typesName}${randomString()}`;
    const structure: StructureMetadata = {
      members: _structures.flatMap((_module) => _module!.members),
      name: structureName,
      constructor: CustomIntersectionDatatype as Constructor,
      isInterface: false,
      metadata: { intersectionOf: dataTypes },
    };

    structures.push(structure);
    Object.defineProperty(CustomIntersectionDatatype, "name", { value: structureName });

    return CustomIntersectionDatatype;
  })();
}
