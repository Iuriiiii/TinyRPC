import { SerializedValue, isObject } from "../mod.ts";

export function isBinaryValue(value: unknown): value is SerializedValue {
  return isObject(value) && "dataType" in value && "value" in value;
}
