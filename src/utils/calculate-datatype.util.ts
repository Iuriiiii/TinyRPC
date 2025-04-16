import type { Datatype } from "../types/mod.ts";
import type { Constructor } from "../mod.ts";
import { assert } from "@std/assert";
import { isArray, isConstructor, isPlainFunction, isPlainObject } from "@online/is";
import { getModule } from "./get-module.util.ts";
import { getExposedEnumName } from "./get-exposed-enum-name.util.ts";
import { getStructure } from "./get-structure.util.ts";
import { isPrimitiveConstructor } from "../validators/mod.ts";

export enum DatatypeType {
  Structure = "structure",
  Enum = "enum",
  Module = "module",
  Object = "object",
  Primitive = "primitive",
  // Intersection = "intersection",
  // Omition = "omition",
  // Partial = "partial",
  // Union = "union",
  // Class instance
  Custom = "custom",
}

export interface CalculatedDatatype {
  type: DatatypeType;
  arrayLevel: number;
  dataType: unknown;
  reference: unknown;
}

export function calculateDatatype(dataType: Datatype): CalculatedDatatype {
  const res: CalculatedDatatype = { arrayLevel: 0, type: DatatypeType.Object, dataType: null, reference: null };
  let currentDataType = dataType;

  while (true) {
    if (isArray(currentDataType)) {
      assert(currentDataType.length === 1, "One element array expected.");

      res.arrayLevel++;
      currentDataType = currentDataType[0] as Datatype;
      continue;
    } else if (isPlainFunction(currentDataType)) {
      currentDataType = (currentDataType as () => unknown)() as Datatype;
      continue;
    }

    break;
  }

  if (isPlainObject(currentDataType)) {
    res.type = getExposedEnumName(currentDataType) ? DatatypeType.Enum : DatatypeType.Object;
  } else if (isConstructor<Constructor>(currentDataType)) {
    do {
      const constructorName = (currentDataType as Constructor).name;
      const module = getModule(constructorName);

      if (module) {
        res.type = DatatypeType.Module;
        res.reference = module;
        break;
      }

      const structure = getStructure(constructorName);

      if (structure) {
        res.type = DatatypeType.Structure;
        res.reference = structure;
        break;
      }

      assert(isPrimitiveConstructor(currentDataType), `Unknown data type: ${constructorName}`);

      res.type = DatatypeType.Primitive;
    } while (false);
  } else {
    res.type = DatatypeType.Custom;
  }

  res.dataType = currentDataType;

  return res;
}
