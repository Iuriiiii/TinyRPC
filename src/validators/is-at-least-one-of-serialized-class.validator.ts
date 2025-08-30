// deno-lint-ignore-file
import type { AtLeastOneOf, SerializedClass } from "@online/miniserializer";
import { isPlainObject } from "@online/is";

export function isAtLeastOneOfSerializedClass(value: unknown): value is AtLeastOneOf<SerializedClass<any>> {
  return isPlainObject(value) && ("arguments" in value || "members" in value);
}
