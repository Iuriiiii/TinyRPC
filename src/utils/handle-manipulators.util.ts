import type { Constructor } from "../types/mod.ts";
import { isClassObject } from "@online/is";
import { getStructure } from "./get-structure.util.ts";
import { getClassName } from "./get-class-name.util.ts";

export function handleManipulators(value: unknown) {
  if (!isClassObject(value)) {
    return value;
  }

  const structure = getStructure(getClassName(value as Constructor));

  if (!structure) {
    return value;
  }

  for (const member of structure.members) {
    const { manipulators = [], name: memberName } = member;
    // @ts-ignore: index access
    let result = value[memberName];

    for (const manipulator of manipulators) {
      result = manipulator(result, value);
    }

    // @ts-ignore: index access
    value[memberName] = result;
  }

  return value;
}
