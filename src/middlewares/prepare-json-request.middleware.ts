import { STATUS_CODE } from "jsr:http";
import { HttpError, isJsonRpcRequest, isPostRequest } from "../mod.ts";
import { deserializeValue } from "@online/bigserializer";
import { getClassByName, undefinedDecoder } from "../utils/mod.ts";
import type { JsonRpcRequest } from "../interfaces/mod.ts";
import type { Constructor, StopFunction } from "../types/mod.ts";

/**
 * Prepare request middleware, check JSON and creates "rpc" object.
 */
export async function prepareJsonRequest(
  request: JsonRpcRequest,
  _response: Response,
  next: StopFunction,
) {
  if (!isPostRequest(request)) {
    throw new HttpError(STATUS_CODE.MethodNotAllowed, "Method not allowed");
  }

  const isNotJSON = request.headers.get("content-type") !== "application/json";

  if (isNotJSON) {
    throw new HttpError(
      STATUS_CODE.UnsupportedMediaType,
      "Unsupported media type",
    );
  }

  let body: unknown = null;

  try {
    body = await request.text();
    body = JSON.parse(body as string, undefinedDecoder);
  } catch {
    throw new HttpError(
      STATUS_CODE.UnprocessableEntity,
      "Invalid request body",
    );
  }

  if (!isJsonRpcRequest(body)) {
    throw new HttpError(
      STATUS_CODE.UnprocessableEntity,
      "Invalid request body",
    );
  }

  const { m: moduleName, fn: methodName, args, mbr } = body;
  const clazz = getClassByName(moduleName) as object | null;

  if (clazz === null) {
    throw new HttpError(STATUS_CODE.BadRequest, "Module not found");
  }

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazz[methodName];
  const _arguments: unknown[] = [];

  for (const argument of args) {
    _arguments.push(deserializeValue(argument));
  }

  Object.defineProperty(request, "rpc", {
    value: {
      clazz: clazz as Constructor,
      procedure,
      arguments: _arguments,
      body,
      client: mbr,
    } satisfies JsonRpcRequest["rpc"],
    writable: false,
  });

  return next();
}