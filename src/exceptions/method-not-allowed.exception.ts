import { HttpError } from "./http-error.exception.ts";
import { STATUS_CODE } from "@std/http";

export class MethodNotAllowedException extends HttpError {
  constructor(message?: string | object) {
    super(STATUS_CODE.MethodNotAllowed, message);
  }
}
