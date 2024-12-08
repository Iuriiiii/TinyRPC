import { STATUS_CODE, type StatusCode } from "@std/http";
import { HttpError } from "../exceptions/mod.ts";

export function crashIf(expression: unknown, message: string, errorCode: StatusCode = STATUS_CODE.BadRequest) {
  if (expression) {
    throw new HttpError(errorCode, message);
  }
}
