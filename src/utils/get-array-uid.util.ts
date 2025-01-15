import { getStringUid } from "./get-string-uid.util.ts";
import { getObjectUid } from "./get-object-uid.util.ts";

export function getArrayUid(values: unknown[]) {
  return values.reduce((acc: number, value: unknown) => {
    if (typeof value === "object" && value) {
      return acc + getObjectUid(value);
    }

    return acc + getStringUid(`${value}`);
  }, 0);
}
