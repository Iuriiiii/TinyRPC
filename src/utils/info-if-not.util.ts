import { infoIf } from "./info-if.util.ts";

export function infoIfNot(expression: unknown, message: string): void {
  return infoIf(!expression, message);
}
