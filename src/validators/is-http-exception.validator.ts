import { HttpError } from "../exceptions/mod.ts";

export function isHttpException(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
