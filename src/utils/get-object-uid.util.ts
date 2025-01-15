import { getStringUid } from "./get-string-uid.util.ts";

export function getObjectUid<T extends object>(obj: T) {
  let result = 0;

  for (const [key, value] of Object.entries(obj)) {
    result += getStringUid(key);

    if (typeof value === "string") {
      result += getStringUid(value);
    } else if (typeof value === "object") {
      result += getObjectUid(value);
    } else if ("toString" in value) {
      result += getStringUid(value.toString());
    }
  }

  return result;
}
