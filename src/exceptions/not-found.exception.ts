import { HttpError } from "./http-error.exception.ts";
import { STATUS_CODE } from "jsr:http";

export class NotFoundException extends HttpError {
  constructor(message?: string | object) {
    super(STATUS_CODE.NotFound, message);
  }
}
