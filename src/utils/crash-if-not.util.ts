import type { StatusCode } from "@std/http";
import { crashIf } from "./crash-if.util.ts";

/**
 * Crash if `expression` is truthy.
 *
 * Default `errorCode` is `STATUS_CODE.BadRequest`
 *
 * asserts `!expression`
 */
export function crashIfNot(expression: unknown, message: string, errorCode?: StatusCode): asserts expression {
  return crashIf(!expression, message, errorCode);
}
