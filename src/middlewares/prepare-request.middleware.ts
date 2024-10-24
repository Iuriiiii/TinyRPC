import { STATUS_CODE } from "jsr:http";
import { HttpError, isPostRequest, isRpcRequest } from "../mod.ts";
import { deserializeValue } from "@online/bigserializer";
import { getClassByName, undefinedDecoder } from "../utils/mod.ts";
import type { RpcRequest } from "../interfaces/mod.ts";
import type { Constructor, NextMiddleware } from "../types/mod.ts";

/**
 * Prepare request middleware, check JSON and creates "rpc" object.
 */
export async function prepareRequest(
  request: RpcRequest,
  _response: Response,
  next: NextMiddleware,
) {
  if (!isPostRequest(request)) {
    throw new HttpError(STATUS_CODE.MethodNotAllowed, "Method not allowed");
  }

  const isJSON = request.headers.get("content-type") === "application/json";

  if (!isJSON) {
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

  if (!isRpcRequest(body)) {
    throw new HttpError(
      STATUS_CODE.UnprocessableEntity,
      "Invalid request body",
    );
  }

  const { m: moduleName, fn: methodName, args } = body;
  const clazz = getClassByName(moduleName) as object | null;

  if (clazz === null) {
    throw new HttpError(STATUS_CODE.BadRequest, "Module not found");
  }

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method with index name.
  const procedure: (...args: unknown[]) => unknown = clazz[methodName];
  const compiledArguments: unknown[] = [];

  for (const argument of args) {
    compiledArguments.push(deserializeValue(argument));
  }

  Object.defineProperty(request, "rpc", {
    value: {
      clazz: clazz as Constructor,
      procedure,
      arguments: compiledArguments,
      body,
    } satisfies RpcRequest["rpc"],
    writable: false,
  });

  return next();
}
