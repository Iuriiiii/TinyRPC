import type { Falsy } from "../types/mod.ts";
import { STATUS_CODE, type StatusCode } from "@std/http";
import { HttpError } from "../exceptions/mod.ts";

export function crashIf(
  expression: unknown,
  message: string,
  errorCode: StatusCode = STATUS_CODE.BadRequest,
): asserts expression is Falsy {
  if (expression) {
    throw new HttpError(errorCode, message);
  }

  return expression as void;
}
