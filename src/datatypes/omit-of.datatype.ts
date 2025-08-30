import type { Constructor, Datatype } from "../types/mod.ts";
import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { assert } from "@std/assert";
import { CustomDatatype } from "../classes/mod.ts";
import { calculateDatatype, DatatypeType, getClassName, getStructure, randomString } from "../utils/mod.ts";
import { omitType } from "./utils/mod.ts";
import { structures } from "../singletons/mod.ts";

interface OmitOfMetadata {
  dataType: Datatype;
  ommitedKeys: string[];
}

const VALID_TYPES = [DatatypeType.Structure, DatatypeType.Module, DatatypeType.Custom];

export class OmitDatatype extends CustomDatatype {
  constructor(public readonly dataType: Datatype, public readonly ommitedKeys: string[]) {
    super();
  }
}

function searchForPreviousOmit(dataType: Datatype, keys: string[]) {
  let result: StructureMetadata | undefined;

  for (const structure of structures) {
    const hasOmitMetadata = structure.metadata.omitOf as OmitOfMetadata | undefined;

    if (!hasOmitMetadata) {
      continue;
    }

    if (
      hasOmitMetadata.dataType === dataType &&
      hasOmitMetadata.ommitedKeys.every((key) => keys.includes(key))
    ) {
      result = structure;
      break;
    }
  }

  return result;
}

export function omitOf<T extends Datatype>(dataType: T, ...keys: string[]): Constructor {
  const calculatedDatatype = calculateDatatype(dataType);

  assert(
    VALID_TYPES.includes(calculatedDatatype.type),
    "Datatype must be a structure, module or custom datatype.",
  );

  return searchForPreviousOmit(dataType, keys)?.constructor || (() => {
    const clazz = calculatedDatatype.reference as Constructor;

    // @ts-ignore: Ignore implementation of `serialize`
    class CustomIntersectionDatatype extends omitType(clazz, ...keys) {}

    // Expose
    const dataTypeClassName = getClassName(clazz);
    const _structure = getStructure(dataTypeClassName)!;
    const structureName = `OmitOf${dataTypeClassName}${randomString()}`;
    const structure: StructureMetadata = {
      members: _structure.members.filter((member) => !keys.includes(member.name)),
      name: structureName,
      constructor: CustomIntersectionDatatype as Constructor,
      isInterface: false,
      metadata: { omitOf: { dataType, ommitedKeys: keys } satisfies OmitOfMetadata },
    };

    structures.push(structure);
    Object.defineProperty(CustomIntersectionDatatype, "name", { value: structureName });

    return CustomIntersectionDatatype;
  })();
}
