// deno-lint-ignore-file
import type { RequireAtLeastOne, SerializedClass } from "@online/packager";
import { isPlainObject } from "@online/is";

export function isRaloSerializedClass(value: unknown): value is RequireAtLeastOne<SerializedClass<any>> {
  return isPlainObject(value) && ("arguments" in value || "members" in value);
}
