import { isNumber } from "./mod.ts";

export function isInfinity(value: unknown): value is number {
  return isNumber(value) && (value === Infinity || value === -Infinity);
}
