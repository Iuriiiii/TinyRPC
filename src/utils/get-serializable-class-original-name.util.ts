import { isClassObject } from "../mod.ts";

export function getSerializableClassOriginalName(clazz: object): string | null {
  return isClassObject(clazz) && "originalName" in clazz
    ? (clazz.originalName as string)
    : null;
}
