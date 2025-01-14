import { info } from "./info.util.ts";

export function infoIf(expression: unknown, message: string): void {
  if (expression) {
    info(message);
  }
}
