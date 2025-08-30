import type { Constructor, Datatype } from "../types/mod.ts";
import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { assert } from "@std/assert";
import { CustomDatatype } from "../classes/mod.ts";
import { calculateDatatype, DatatypeType, getClassName, getStructure, randomString } from "../utils/mod.ts";
import { partialType } from "./utils/mod.ts";
import { structures } from "../singletons/mod.ts";

const VALID_TYPES = [DatatypeType.Structure, DatatypeType.Module, DatatypeType.Custom];

export class PartialDatatype extends CustomDatatype {
  constructor(public readonly dataType: Datatype) {
    super();
  }
}

function searchForPreviousPartial(dataType: Datatype) {
  let result: StructureMetadata | undefined;

  for (const structure of structures) {
    const hasPartialMetadata = structure.metadata.partialOf as Datatype | undefined;

    if (!hasPartialMetadata) {
      continue;
    }

    if (hasPartialMetadata === dataType) {
      result = structure;
      break;
    }
  }

  return result;
}

export function partialOf(dataType: Datatype): Constructor {
  const calculatedDatatype = calculateDatatype(dataType);

  assert(
    VALID_TYPES.includes(calculatedDatatype.type),
    "Datatype must be a structure, module or custom datatype.",
  );

  return searchForPreviousPartial(dataType)?.constructor || (() => {
    const clazz = calculatedDatatype.reference as Constructor;

    // @ts-ignore: Ignore implementation of `serialize`
    class CustomIntersectionDatatype extends partialType(clazz) {}

    // Expose
    const dataTypeClassName = getClassName(clazz);
    const _structure = getStructure(dataTypeClassName)!;
    const structureName = `PartialOf${dataTypeClassName}${randomString()}`;
    const structure: StructureMetadata = {
      members: _structure.members.map((member) => ({ ...member, optional: true })),
      name: structureName,
      constructor: CustomIntersectionDatatype as Constructor,
      isInterface: false,
      metadata: { partialOf: dataType },
    };

    structures.push(structure);
    Object.defineProperty(CustomIntersectionDatatype, "name", { value: structureName });

    return CustomIntersectionDatatype;
  })();
}
