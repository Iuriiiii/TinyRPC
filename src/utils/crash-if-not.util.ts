import type { StatusCode } from "@std/http";
import { crashIf } from "./crash-if.util.ts";

export function crashIfNot(expression: unknown, message: string, errorCode?: StatusCode): asserts expression {
  return crashIf(!expression, message, errorCode);
}
