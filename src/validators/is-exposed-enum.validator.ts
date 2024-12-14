import { isUndefined } from "@online/is";

export function isExposedEnum(_enum: object): boolean {
  return !isUndefined(Object.getOwnPropertyDescriptor(_enum, "__TS_ENUM__")?.value);
}
