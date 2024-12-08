import type { StatusCode } from "@std/http";
import { crashIf } from "./crash-if.util.ts";

export function crashIfNot(expression: unknown, message: string, errorCode?: StatusCode) {
  crashIf(!expression, message, errorCode);
}
