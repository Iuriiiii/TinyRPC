import { STATUS_CODE } from "deno:http";
import {
  HttpError,
  isPostRequest,
  isRpcRequest,
  MethodNotAllowedException,
  NotFoundException,
} from "../mod.ts";
import { deserializeValue } from "@online/bigserializer";
import { getClassByName, undefinedDecoder } from "../utils/mod.ts";
import type { RpcRequest } from "../interfaces/mod.ts";
import type { NextMiddleware } from "../types/mod.ts";

export async function prepareRequest(
  request: RpcRequest,
  _response: Response,
  next: NextMiddleware,
) {
  if (!isPostRequest(request)) {
    throw new MethodNotAllowedException();
  }

  const isJSON = request.headers.has("content-type") &&
    request.headers.get("content-type") === "application/json";

  if (!isJSON) {
    throw new HttpError(STATUS_CODE.UnsupportedMediaType);
  }

  let body: unknown = null;

  try {
    body = await request.text();
    body = JSON.parse(body as string, undefinedDecoder);
  } catch {
    throw new HttpError(STATUS_CODE.UnprocessableEntity);
  }

  if (!isRpcRequest(body)) {
    throw new HttpError(STATUS_CODE.UnprocessableEntity);
  }

  const { m: moduleName, fn: methodName, args } = body;
  // TODO: Improve this
  const clazz = getClassByName(moduleName);

  if (clazz === null) {
    throw new NotFoundException();
  }

  // TODO: Add an option to able a class to be created each time the method is called
  // @ts-ignore: Get class method.
  const procedure: (...args: unknown[]) => unknown = clazz[methodName];
  const compiledArguments: unknown[] = [];

  for (const argument of args) {
    const value: unknown = deserializeValue(argument);

    compiledArguments.push(value);
  }

  Object.defineProperty(request, "rpc", {
    value: {
      procedure,
      arguments: compiledArguments,
      body,
    },
    writable: false,
  });

  return next();
}
