import { log } from "./log.util.ts";

export function logIf(expression: unknown, message: string) {
  if (expression) {
    log(message);
  }
}
