import { info } from "./info.util.ts";

export function infoIf(expression: unknown, message: string) {
  if (expression) {
    info(message);
  }
}
