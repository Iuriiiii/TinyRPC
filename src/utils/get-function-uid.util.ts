// deno-lint-ignore-file
import { getStringUid } from "./get-string-uid.util.ts";

export function getFunctionUid(fn: Function) {
  return getStringUid(fn.toString());
}
