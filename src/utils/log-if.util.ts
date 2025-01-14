import { log } from "./log.util.ts";

export function logIf(expression: unknown, message: string): void {
  if (expression) {
    log(message);
  }
}
