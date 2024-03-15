import { isNumber } from "./is-number.validator.ts";

export function isNaN(value: unknown): value is number {
  return isNumber(value) && Number.isNaN(value);
}
