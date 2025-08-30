import type { Constructor, Datatype } from "../types/mod.ts";
import type { StructureMetadata } from "../singletons/interfaces/mod.ts";
import { assert } from "@std/assert";
import { calculateDatatype, DatatypeType, getClassName, getStructure, randomString } from "../utils/mod.ts";
import { pickType } from "./utils/mod.ts";
import { structures } from "../singletons/mod.ts";

interface PickOfMetadata {
  dataType: Datatype;
  pickedKeys: string[];
}

const VALID_TYPES = [DatatypeType.Structure, DatatypeType.Module, DatatypeType.Custom];

function searchForPreviousPick(dataType: Datatype, keys: string[]) {
  let result: StructureMetadata | undefined;

  for (const structure of structures) {
    const hasPickMetadata = structure.metadata.pickOf as PickOfMetadata | undefined;

    if (!hasPickMetadata) {
      continue;
    }

    if (
      hasPickMetadata.dataType === dataType &&
      hasPickMetadata.pickedKeys.every((key) => keys.includes(key)) &&
      hasPickMetadata.pickedKeys.length === keys.length
    ) {
      result = structure;
      break;
    }
  }

  return result;
}

export function pickOf<T extends Datatype>(dataType: T, ...keys: string[]): Constructor {
  const calculatedDatatype = calculateDatatype(dataType);

  assert(
    VALID_TYPES.includes(calculatedDatatype.type),
    "Datatype must be a structure, module or custom datatype.",
  );

  return searchForPreviousPick(dataType, keys)?.constructor || (() => {
    const clazz = calculatedDatatype.reference as Constructor;

    // @ts-ignore: Ignore implementation of `serialize`
    class CustomIntersectionDatatype extends pickType(clazz, ...keys) {}

    // Expose
    const dataTypeClassName = getClassName(clazz);
    const _structure = getStructure(dataTypeClassName)!;
    const structureName = `OmitOf${dataTypeClassName}${randomString()}`;
    const structure: StructureMetadata = {
      members: _structure.members.filter((member) => keys.includes(member.name)),
      name: structureName,
      constructor: CustomIntersectionDatatype as Constructor,
      isInterface: false,
      metadata: { pickOf: { dataType, pickedKeys: keys } satisfies PickOfMetadata },
    };

    structures.push(structure);
    Object.defineProperty(CustomIntersectionDatatype, "name", { value: structureName });

    return CustomIntersectionDatatype;
  })();
}
