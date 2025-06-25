import type { Datatype } from "../types/mod.ts";
import type { Constructor } from "../mod.ts";
import { assert } from "@std/assert";
import { isArray, isConstructor, isPlainFunction, isPlainObject } from "@online/is";
import { getModule } from "./get-module.util.ts";
import { getExposedEnumName } from "./get-exposed-enum-name.util.ts";
import { getStructure } from "./get-structure.util.ts";
import { isPrimitiveConstructor } from "../validators/mod.ts";
import { CustomDatatype } from "../classes/mod.ts";

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

/**
 * Calculate the type of a given `dataType`.
 *
 * Returns an object with the following properties:
 *  - `type`: The type of the `dataType`, one of `DatatypeType`.
 *  - `arrayLevel`: The level of array nesting, if any.
 *  - `dataType`: The actual value of the `dataType`.
 *  - `reference`: The reference to the type, either the constructor function, the module, or the structure.
 *
 * @throws {Error} If `dataType` is not recognized.
 *
 * @example
 *  const result = calculateDatatype(String);
 *  console.log(result.type); // "primitive"
 *  console.log(result.reference); // String
 *
 *  const result = calculateDatatype([String]);
 *  console.log(result.type); // "primitive"
 *  console.log(result.arrayLevel); // 1
 *  console.log(result.reference); // String
 *
 * @param dataType The data type to calculate.
 * @returns An object with the type information.
 */
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
  } else if (
    isConstructor<Constructor>(currentDataType) &&
    !((currentDataType as Constructor).prototype instanceof CustomDatatype)
  ) {
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
      res.reference = currentDataType;
    } while (false);
  } else if (currentDataType === null) {
    res.type = DatatypeType.Primitive;
    res.reference = currentDataType;
  } else {
    res.type = DatatypeType.Custom;
    res.reference = currentDataType;
  }

  res.dataType = currentDataType;

  return res;
}
